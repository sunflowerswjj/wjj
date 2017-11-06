let indexRender = (function () {
    let $sign = $(".sign"),
        $search = $(".search").children("input"),
        $searchBtn = $(".searchBtn"),
        $oUl = $(".userList").children("ul"),
        $tip = $(".tip"),
        userId =userInfo ? userInfo["id"] : 0,
        limit=10,
        page=1,
        search="",
        pageNum = 0,
        total = 0,
        $plan = $.Callbacks();
    let handMatch = () => {
        //先判断下是否登录,再判断下是否参赛过,若参赛过,则我要参赛的按钮则不显示
        if (userInfo) {
            $.ajax({
                url: "/getUser",
                data:{
                    userId:userId
                },
                dataType:"json",
                success:function(result){
                    if(result["code"]==0&&result["data"]["isMatch"]==1){
                        $sign.css("display","none");
                    }
                }
            })

        }else{
            //绑定点击事件
            $sign.on("click",function(){
                new Dialog("请先登录");
                return false;//阻止a标签的默认行为
            })
        }

    };

    //->绑定数据
    let bindData = (dataList)=>{
       let str = ``;
       $.each(dataList,function(index,item){
           str+=`
           <li>
                <a href="detail.html?userId=${item.id}">
                    <img src="${item.picture}" alt="" class="picture">
                    <p class="title">
                        <span>${item.name}</span>
                        |
                        <span>编号#${item.matchId}</span>
                    </p>
                    <p class="slogan">${item.slogan}</p>
                </a>
                <div class="vote">
                    <span class="voteNum">${item.voteNum}</span>
                     ${item.isVote==0?`<a href="javascript:;" class="voteBtn" data-id="${item.id}">投他一票</a>`:``}; 
                </div>
            </li>
           `
       });
        $oUl.append(str);
    };
    $plan.add(bindData);

    //2.滚动条距离底部200px时,重新再加载更多数据的处理
     let scrollFn = ()=>{
         let fn = ()=>{
            let clientH = document.documentElement.clientHeight||document.body.clientHeight;
            let scrollT = document.documentElement.scrollTop||document.body.scrollTop;
            let scrollH = document.documentElement.scrollHeight||document.body.scrollHeight;
            if(clientH+scrollT+200>=scrollH){ //再获取一屏的数据
                //防止会不断的重新请求
                $(window).off("scroll",fn);
                page++;
                if(page>pageNum) return;
                $.ajax({
                    url:"/getMatchList",
                    data:{
                        limit:limit,
                        page:page,
                        search:search,
                        userId:userId
                    },
                    dataType:"json",
                    success:function(result){
                        if(result.code==0){
                            bindData(result.list);
                             window.setTimeout(function(){
                                $(window).on("scroll",fn)
                            },500);
                        }
                    }
                })
            }
         };

         $(window).on("scroll",fn);
     }
     $plan.add(scrollFn);

    //3.投票处理
      let voteFn = ()=>{
          $oUl.on("click",(e)=>{
              let target = e.target;

              if(target.className =="voteBtn"){
                  if(!userInfo){
                      new Dialog("请先登录");
                      return false;
                  }else{
                      $.ajax({
                          url:"/vote",
                          data:{
                              userId:userId,
                              participantId:$(target).attr("data-id")
                          },
                          dataType:"json",
                          success:function(result){
                              if(result.code  ==0){
                                  new Dialog("恭喜你,投票成功",function(){
                                      let $voteNum = $(target).prev();
                                      $voteNum.html(parseFloat($voteNum.html())+1);
                                      $(target).remove();
                                  })
                              }else if(result.code==1){
                                  new Dialog("投票失败,请重新投票");
                                  window.location.reload(true);
                              }
                          }
                      })

                  }
              }
          })
      };
    $plan.add(voteFn);
    let success = (result)=>{
            $oUl.html("");
            if(result.code==0){
                $tip.hide();
                $oUl.show();
                pageNum = parseFloat(result.pageNum);
                total = parseFloat(result.total);
                $plan.fire(result.list);

            }else if(result.code==1){
                $tip.show();
                $oUl.hide();
            }
    }
    let getData = (search) => {
            $.ajax({
                url:"/getMatchList",
                data:{
                   limit:limit,
                   page:page,
                   search:search,
                   userId:userId
                },
                dataType:"json",
                success:success
            })
    };
    return {
        init() {
            //判断是否登录,处理我要参赛部分
            handMatch();
            //获取所有的数据
            getData(search);
            //处理搜索部分
            $searchBtn.tap(()=>{
                let val = $search.val();
                getData(val);
            })

        }
    }
})();
indexRender.init();


