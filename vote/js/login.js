let loginRender = (function(){
    let $userName = $("#userName"),
        $userPass = $("#userPass"),
        $submit = $("#submit");
   let success = (result)=>{
       //result.code  =>1 登录失败 =>0登录成功
       if(result["code"]==1){
           new Dialog("登录失败");
           window.location.reload(true);
           return;
       }
       if(result["code"]==0){
           new Dialog("恭喜你登录成功",function(){
               //->把返回的data存在cookie
               cookie.set("userInfo",JSON.stringify(result["data"]));
               window.location.href = `index.html?url=${encodeURIComponent(window.location.href)}`;

           })
           return;
       }

   };
    return {
        init(){
            $submit.tap(()=>{
              $.ajax({
                  url:"/login",
                  type:"post",
                  data:{
                      name:$userName.val().trim(),
                      password:hex_md5($userPass.val().trim())
                  },
                  dataType:"json",
                  success:success
              })


            })
        }
    }
})();
loginRender.init();
