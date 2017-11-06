﻿let detailRender = (function () {
    let $headerBox = $('.headerBox'),
        $myVote = $('#myVote').find('.list'),
        $voteMy = $('#voteMy').find('.list'),
        $voteBtn = null;
    let {userId} = window.location.href.myQueryURLParameter();
    userId = userId || 0;
    let userInfoId = userInfo ? userInfo['id']:0;
    let isMe = false,
        isMatch = false,
        voteFlag = false,
        $plan = $.Callbacks();

    //1.绑定数据
    $plan.add((data) => {
        isMatch = data.isMatch;
        let str = `
            <div class="userInfo">
            <img src="${data.picture}" alt="" class="picture">
            <p class="info">
                <span>${data.name}</span>
                |
                <span>${data.matchId}</span>
            </p>
            <p class="bio">${data.bio}</p>
            <div class="vote">${data.voteNum}</div>
        </div>
        <div class="slogan">${data.isMatch == 1 ? data.slogan : ``}</div>
        <a href="javascript:;" class="voteBtn">投他一票</a>`;
        $headerBox.html(str);
    });
    //2.处理投票按钮,是显示还是移除的
    $plan.add(() => {
        $voteBtn = $(".voteBtn");
        if (isMe) {
            $voteBtn.remove();
            return;
        }
        if (isMatch == 0) {
            $voteBtn.remove();
            return;
        }
        $.ajax({
            url: "/checkUser",
            data: {
                userId: userInfoId,
                checkId: userId
            },
            dataType: "json",
            success: function (result) {
                if (result.code == 0 && result.isVote == 1) {
                    $voteBtn.remove();
                }
            }
        })

    })

    //3.若投票按钮存在,绑定点击事件
    $plan.add(() => {
        $voteBtn.tap(() => {
            if (!userInfo) {
                new Dialog("请先登录", function () {
                    window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                })
                return;
            }
            $.ajax({
                url: "/vote",
                data: {
                    userId: userInfoId,
                    participantId: userId
                },
                dataType: "json",
                success: function (result) {
                    if (result.code == 1) {
                        new Dialog("投票发生意外,请重新投");
                        window.location.reload(true);
                        return;
                    }
                    if (result.code == 0) {
                        new Dialog("恭喜投票成功", function () {
                            window.location.reload(true);
                        })
                        return;
                    }
                }
            })
        })
    })

    let voteDate = (list, flag) => {
            let str = ``;
            $.each(list, function (index, item) {
                str += `
             <li>
            <a href="detail.html?userId=${item.id}">
                <img src="${item.picture}" alt="" class="picture">
                <p class="title">${item.name}</p>
                <p class="bio">${item.slogan}</p>
            </a>
            <div class="vote">
                <span class="voteNum">${item.voteNum}</span>
              ${item.isVote==0?`<a href="javascript:;" class="voteBtn2" data-id="${item.id}">投他一票</a>`:``} 
            </div>
        </li>
             `

            })

            flag == 0 ? $voteMy.html(str) : $myVote.html(str);
        }
    let voteEvent = ()=>{
        $voteMy.tap((e)=>{
            let target = e.target;
            if(target.className =="voteBtn2"){
                //防止重复点击重复请求
                if(voteFlag) return;
                voteFlag = true;
                $.ajax({
                    url: "/vote",
                    data: {
                        userId: userInfoId,
                        participantId: $(target).attr("data-id")
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.code == 1) {
                            new Dialog("投票发生意外,请重新投");
                            window.location.reload(true);
                            return;
                        }
                        if (result.code == 0) {
                            new Dialog("恭喜投票成功", function () {
                                window.location.reload(true);
                            })
                            return;
                        }
                    }
                })
            }
        })
    }
    let sendAjax = (flag) => {
        let url = flag == 0 ? "/getVoteMy" : "/getMyVote";
        $.ajax({
            url: url,
            data: {
                userId: userInfoId
            },
            dataType: "json",
            success: function (result) {
                if (result.code == 1) return;
                if (result.code == 0) {
                    flag == 0 ? $("#voteMy").show() : $("#myVote").show();
                    voteDate(result.list, flag);
                    voteEvent()
                }
            }
        })
    };

    //4.若展示是自己的信息,获取投递我的人员和我投递的人员
    $plan.add(()=>{
        if(userId == userInfoId||userId==0&&userInfo){//只有是自己才显示投递我的人员和我投递的人员
            sendAjax(0); //0投递我
            sendAjax(1);  //1我投递的
        }
    });


    return {
        init() {
            //1.是否登录
            if (!userInfo) {
                new Dialog("请先登录", function () {
                    window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                })
                return;
            }
            //2.检测时自己还是别人
                if (userId == 0 || userId == userInfoId) {
                    isMe = true;
                }
            //3.展示信息
            $.ajax({
                url: "/getUser",
                data: {
                    userId: userId == 0 ? userInfoId : userId
                },
                dataType: "json",
                success: function (result) {
                    if (result.code == 1) return;
                    if (result.code == 0) {
                        $plan.fire(result.data);
                    }
                }
            })
        }
    }
})();
detailRender.init();