let joinRender = (function(){
        let $slogan = $("#slogan"),
            $spanSlogan = $("#spanSlogan"),
            $submit = $("#submit");
    let checkSlogan = ()=>{
        let val = $slogan.val().trim();
        if (val.length < 10) {
            $spanSlogan.html("您也太懒了,至少得输入10个字").addClass("error");
            return false;
        }
        if (val.length > 100) {
            $spanSlogan.html("您也太勤快了,这样不太好").addClass("error");
            return false;
        }
        $spanSlogan.html("").removeClass("error");
        return true;
    }
    let success = (result)=>{
        let code = result["code"];
        if(code ==1){
            new Dialog("参赛失败");
            window.location.reload(true);
            return;
        }
        if(code==0){
            new Dialog("参赛成功",function(){
                window.location.href = `index.html?url=${encodeURIComponent(window.location.href)}`
            })
            return;
        }
    }
    return {
        init(){
            let userInfo = JSON.parse(cookie.get("userInfo"));
            $slogan.on("blur",checkSlogan);
            $submit.tap(()=>{
                if(!userInfo){
                    new Dialog("请先登录",function(){
                        window.location.href =  `login.html?url=${encodeURIComponent(window.location.href)}`;
                    });
                    return;
                }
                if(checkSlogan()){
                    $.ajax({
                        url:"/match",
                        data:{
                            userId:userInfo.id,
                            slogan:$slogan.val().trim()
                        },
                        dataType:"json",
                        success:success
                    })
                }

            })
        }
    }
})();
joinRender.init();