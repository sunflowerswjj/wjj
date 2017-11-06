let registerRender = (function () {
    //1.获取所有需要操作的元素
    let $userName = $("#userName"),
        $spanName = $("#spanName"),
        $userPhone = $("#userPhone"),
        $spanPhone = $("#spanPhone"),
        $userPass = $("#userPass"),
        $spanPass = $("#spanPass"),
        $userPassConfirm = $("#userPassConfirm"),
        $spanPassConfirm = $("#spanPassConfirm"),
        $userBio = $("#userBio"),
        $spanBio = $("#spanBio"),
        $man = $("#man"),
        $submit = $("#submit");

    //->验证姓名
    let checkName = () => {
        let val = $userName.val().trim();
        let reg = /^[\u4e00-\u9fa5]{2,5}$/;
        if (val.length == 0) {
            $spanName.html("请输入内容").addClass("error");
            return false;
        }
        if (!reg.test(val)) {
            $spanName.html("请输入2到5位中文的姓名").addClass("error");
            return false;
        }
        $spanName.html("").removeClass("error");
        return true;
    };
    //->检测手机号码
    let checkPhone = () => {
        let val = $userPhone.val().trim();
        let reg = /^1\d{10}$/;
        if (val.length == 0) {
            $spanPhone.html("请输入手机号码").addClass("error");
            return false;
        }
        if (!reg.test(val)) {
            $spanPhone.html("请输入11位的手机号码").addClass("error");
            return false;
        }
        let code = 0;
        $.ajax({
            url: "/checkPhone",
            data: {
                phone: val
            },
            async: false,
            dataType: "json",
            success: function (result) {
                code = result["code"];
            }
        });
        if (code == 1) {
            $spanPhone.html("当前手机号码已经注册过").addClass("error");
            return false;
        }
        $spanPhone.html("").removeClass("error");
        return true;
    };
    //->验证密码
    let checkPass = () => {
        let val = $userPass.val().trim();
        let reg = /^\w{6,12}$/;
        if (val.length == 0) {
            $spanPass.html("请输入密码").addClass("error");
            return false;
        }
        if (!reg.test(val)) {
            $spanPass.html("请输入6~12位数字和字母").addClass("error");
            return false;
        }
        $spanPass.html("").removeClass("error");
        return true;
    };
    //->密码确认
    let checkPassConfirm = () => {
        let val1 = $userPass.val().trim();
        let val2 = $userPassConfirm.val().trim();
        if (val1 != val2) {
            $spanPassConfirm.html("两次输入的密码不一样").addClass('error');
            return false;
        }
        $spanPassConfirm.html("").removeClass("error");
        return true;
    };
    //自我描述
    let checkBio = () => {
        let val = $userBio.val().trim();
        if (val.length < 10) {
            $spanBio.html("您也太懒了,至少得输入10个字").addClass("error");
            return false;
        }
        if (val.length > 100) {
            $spanBio.html("您也太勤快了,这样不太好").addClass("error");
            return false;
        }
        $spanBio.html("").removeClass("error");
        return true;
    };

    let success = function(result){
            if(result["code"]==1){
                new Dialog("注册失败,请重新注册");
                window.location.reload(true);
                return;
            }
            if(result['code']==0){
                new Dialog("注册成功",function(){
                    //->把返回的data保存在cookie里
                    cookie.set("userInfo",JSON.stringify(result["data"]));
                   window.location.href = `index.html?url=${encodeURIComponent(window.location.href)}`
                    return;
                })
            }
    }
    return {
        init() {
            //2.当输入框失去焦点时 ,每个输入框进行相应的验证
            $userName.on("blur", checkName);
            $userPhone.on("blur", checkPhone);
            $userPass.on("blur", checkPass);
            $userPassConfirm.on("blur", checkPassConfirm);
            $userBio.on("blur", checkBio);

            //3.按钮绑定点击事件,当所有的输入框验证通过时,发起请求,把所有数据发送给后台
            $submit.tap(() => {
                if (checkName() && checkPhone() && checkPass() && checkPassConfirm() && checkBio()) {
                    console.log($man);
                    $.ajax({
                        url: "/register",
                        type: "post",
                        data: {
                            name: $userName.val().trim(),
                            password: hex_md5($userPass.val().trim()),
                            phone: $userPhone.val().trim(),
                            sex: $man[0].checked ? 0 : 1,
                            bio: $userBio.val().trim()
                        },
                        dataType:"json",
                        success:success
                    })

                }
            })

        }
    }
})();
registerRender.init();