//->解析url的query部分 ->返回一个对象
String.prototype.myQueryURLParameter = function () {
    let obj = {},
        reg = /([^?&=#]+)=([^?&=#]+)/g;
    this.replace(reg, function ($0, $1, $2) {
        obj[$1] = $2;
    });
    return obj;
};

//->封装模态框的插件
class Dialog {
    constructor(content, callback) {
        this.content = content;
        this.callback = callback;
        this.init();
    }

    init() {
        //1.创建模态框
        this.createMark();
        //2.绑定点击事件
        this.markEvent();
        //3.移除模态框
        window.setTimeout(() => {
            this.removeMark();
        }, 2000)

    }

    createMark() {
        this.removeMark();
        let mark = document.createElement("div");
        mark.className = "markDialog";
        this.mark = mark;
        let str = `<div class="box">
            <h3>系统提示</h3>
            <div class="content">${this.content}</div>
            </div>`;
        document.body.appendChild(mark);
        mark.innerHTML = str;
    }

    markEvent() {
        if (!this.mark) return;
        $(this.mark).tap((e) => {
            if (e.target.className == "markDialog") {
                this.removeMark();
            }
        })
    }

    removeMark() {
        if (this.mark) {
            //$(this.mark).remove();
            document.body.removeChild(this.mark);
            this.mark = null;
            this.callback && this.callback();
        }
    }
}


//->cookie  设置cookie  读取cookie 移除cookie

let cookie = (function () {
//->设置cookie
//encodeURIComponent() ->设置url的字符串  解码decodeURIComponent()
//escape  ->普通字符串 ->编码字符串     解码 unescape

    let setValue = (name, value, expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000), path = "/", domain = "") => {
        document.cookie = `${name}=${escape(value)};expires=${expires.toGMTString()};path=${path};domain=${domain}`;
    };

    //获得cookie
    let getValue = (name) => {
        let dCookie = document.cookie;
        if (dCookie) {
            let reg = new RegExp(`(?:^| *)${name}=([^;]*)(?:|;$)`);
            let ary = dCookie.match(reg);
            return ary.length > 0 ? unescape(ary[1]) : null;
        }
        return null;
    };

    //移除cookie
    let removeValue = (name, path = "/", domain = " ") => {
        //->es6模板字符串里本身表示字符串,path后面值表示路径,不要再加"";
        document.cookie = `${name}=" ";path=${path};domain=${domain};expires =${new Date(0)}`;
    };
    return {
        set: setValue,
        get: getValue,
        remove: removeValue
    }
})()

let navRender = (function () {
    let $navBox = $(".navBox"),
        $link = $navBox.children("a"),
        userInfo = JSON.parse(cookie.get("userInfo"));
        //console.log(userInfo);//{id: 189, name: "王燕", password: "f02f750e65ebba95ab9493cd"}
    return {
        init() {
            if (userInfo) {
                $link.each(function (index, item) {
                    if (index == 1 || index == 2) {
                        $(item).hide();
                    } else {
                        $(item).css("display", "inline-block");
                    }
                });
                $link.eq(3).html(userInfo["name"]);
                $link.eq(4).tap(function(){
                    cookie.remove("userInfo");
                    window.location.href = "index.html";
                })
            } else {
                $link.tap(function () {
                    let index = $(this).index();
                    if (index == 1) { //->登录
                        window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                    } else if (index == 2) {//->注册
                        window.location.href = `register.html?url=${encodeURIComponent(window.location.href)}`;
                    }
                })
            }
        }
    }

})();
navRender.init();
;(function(){
    window.userInfo = JSON.parse(cookie.get("userInfo"));
})();





