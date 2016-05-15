    /*干掉默认事件*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    /*自适应处理*/
    function resize(){
    var size=function(){return $(window).width()/750;};
    $("html").css({
        "-webkit-transform":"scale("+size()+")",
        "transform":"scale("+size()+")",
        "height":(($(window).height()/$(window).width())*750)+"px"
        });
    }
    /*先执行一次*/
    resize();
    /*屏幕有变动的时候再执行*/
    $(window).on("resize",resize);
    /*滚屏*/
    $(".wrap").each(function(){
        new IScroll('#'+$(this).attr("id"), {  });
    });
    /************通用方法*************/
    (function(){
     /*显示密码*/
    $(".password .rightIcon").unbind("tap").bind("tap",function(){
        if($(this).parents(".input_module").find("input").attr("type")=="password"){
            $(this).parents(".input_module").find("input").attr("type","text");
            $(this).parents(".input_module").addClass("show");
        }else{
            $(this).parents(".input_module").find("input").attr("type","password");
            $(this).parents(".input_module").removeClass("show");
        }
    });
      /*获取验证码*/
    $(".getCode .rightButton").unbind("tap").bind("tap",function(){
        if($(this).parents(".input_module").attr("lock")=="1"){
            return false;
        }
        /*手机号*/
        var phone=$(this).parents(".input_module").find("input").val();
        if(!phone){
            tool.pop("请填写手机号");
            return false;
        }
        $(this).parents(".input_module").attr("lock","1");
        var that=this;
        var clock=0;
        var codeDelay=setInterval(function(){
            if(clock<30){
                clock++;
                $(that).html(clock+"秒后可重发");
                $(that).addClass("disable");
            }else{
                $(that).parents(".input_module").attr("lock","0");
                $(that).html("获取验证码");
                $(that).removeClass("disable");
                clearInterval(codeDelay);
            }
        },1000);
    }); 
    })();
    /************工具方法*************/
    var tool = {};
    /*弹出*/
    /*text:弹出内容*/
    /*fn:关闭回调*/
    tool.pop = function(text,fn){
        $("#pop #popMain").text(text);
        $("#pop").show();
        $("#popBg").show();
        $("#pop #popButton").unbind("tap").bind("tap",function(){
            $("#pop").hide();
            $("#popBg").hide();
            if(fn){
                fn();
            }
        });
        $("#popBg").unbind("tap").bind("tap",function(){
            $("#pop").hide();
            $("#popBg").hide();
            if(fn){
                fn();
            }
        });
    };
    /************登录注册*************/
;(function(){
        /*登录注册切换*/
    function L2R(page){
        $(".nav_module .line").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate("+page*100+"%, 0px) translateZ(0px)"
        });
        $("#login_page #pageRoll").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate(-"+page*750+"px, 0px) translateZ(0px)"
        });
    }
    /*点击登录(导航)*/
$("#login_page .nav_module #loginNav").unbind("tap").bind("tap",function(){
    L2R(0);
})
    /*点击注册(导航)*/
$("#login_page .nav_module #registNav").unbind("tap").bind("tap",function(){
    L2R(1);
})
/*非空验证*/
function noEmpty(){
    /*手机号码*/
    var phone=$("#login_page #loginPhone input").val();
    /*密码*/
    var key=$("#login_page #loginKey input").val();
    /*手机号为空*/
    if(!phone){        
        return false;
    }
    /*密码为空*/
    if(!key){
        return false;
    }
    return true;
}
    /*手机号填写*/
$("#login_page #loginPhone input,#login_page #loginKey input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#login_page #loginButton").addClass("disable");
    }else{
        $("#login_page #loginButton").removeClass("disable");
    }
})
    /*点击登录*/
$("#login_page #loginButton").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("手机号或密码为空"); 
       return false;
    }
});
    /*点击忘记密码*/
$("#login_page #forgetKey").unbind("tap").bind("tap",function(){
    window.location.href="忘记密码.html";
});
})();
    /************登录注册*************/
(function(){
    /*非空验证*/
    function noEmpty(){
    /*手机号码*/
    var phone=$("#login_page #registPhone input").val();
    /*验证码*/
    var code=$("#login_page #registCode input").val();
    /*密码*/
    var key=$("#login_page #registKey input").val();
    /*手机号为空*/
    if(!phone){        
        return false;
    }
    /*验证码为空*/
    if(!code){        
        return false;
    }
    /*密码为空*/
    if(!key){
        return false;
    }
    return true;
}
    /*手机号验证码密码填写*/
$("#login_page #registPhone input,#login_page #registCode input,#login_page #registKey input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#login_page #registButton").addClass("disable");
    }else{
        $("#login_page #registButton").removeClass("disable");
    }
})
    /*点击下一步*/
$("#login_page #registButton").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("请完整填写注册信息"); 
       return false;
    }
    window.location.href="注册第二步.html";
});
})();
    /************注册第二步*************/
(function(){
    /*非空验证*/
    function noEmpty(){
    /*姓名*/
    var name=$("#regist2_page #name input").val();
    /*身份证号码*/
    var idCode=$("#regist2_page #card input").val();
    /*姓名*/
    if(!name){        
        return false;
    }
    /*身份证号码*/
    if(!idCode){        
        return false;
    }
    return true;
}
        /*手机号验证码密码填写*/
$("#regist2_page #name input,#regist2_page #card input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#regist2_page #registButton").addClass("disable");
    }else{
        $("#regist2_page #registButton").removeClass("disable");
    }
})
    /*点击下一步*/
$("#regist2_page #registButton").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("请完整填写注册信息"); 
       return false;
    }
});
})();
    /************忘记密码*************/
(function(){
        /*非空验证*/
    function noEmpty(){
    /*手机号码*/
    var phone=$("#forgetKey_page #forgetPhone input").val();
    /*验证码*/
    var code=$("#forgetKey_page #forgetCode input").val();
    /*姓名*/
    if(!phone){        
        return false;
    }
    /*身份证号码*/
    if(!code){        
        return false;
    }
    return true;
}
        /*手机号验证码密码填写*/
$("#forgetKey_page #forgetPhone input,#forgetKey_page #forgetCode input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#forgetKey_page #resetButton").addClass("disable");
    }else{
        $("#forgetKey_page #resetButton").removeClass("disable");
    }
})
    /*点击重设密码*/
$("#forgetKey_page #resetButton").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("请完整填写验证信息"); 
       return false;
    }
});
    /*点击旧号不用的*/
$("#forgetKey_page #new").unbind("tap").bind("tap",function(){
    window.location.href="更换手机号.html";
});
    /*点击返回登录页*/
$("#forgetKey_page #back").unbind("tap").bind("tap",function(){
    window.location.href="登录注册.html";
});
})();
    /************更换手机号*************/
(function(){
    /*非空验证*/
    function noEmpty(){
    /*手机号码*/
    var phone=$("#newPhone_page #newPhonePhone input").val();
    /*验证码*/
    var code=$("#newPhone_page #newPhoneCode input").val();
    /*手机号码为空*/
    if(!phone){        
        return false;
    }
    /*验证码为空*/
    if(!code){        
        return false;
    }
    return true;
}
        /*手机号验证码填写*/
$("#newPhone_page #newPhonePhone input,#newPhone_page #newPhoneCode input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#newPhone_page #newPhoneButton").addClass("disable");
    }else{
        $("#newPhone_page #newPhoneButton").removeClass("disable");
    }
})
    /*点击下一步*/
$("#newPhone_page #newPhoneButton").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("请完整填写手机及验证码"); 
       return false;
    }
    window.location.href="更换手机号2.html";
});
    /*点击返回登录页*/
$("#newPhone_page #newPhoneback").unbind("tap").bind("tap",function(){
    window.location.href="登录注册.html";
});
})();
    /************更换手机号*************/
(function(){
    /*非空验证*/
    function noEmpty(){
    /*姓名*/
    var name=$("#newPhone2_page #name input").val();
    /*身份证号码*/
    var idCode=$("#newPhone2_page #card input").val();
    /*最近检查年月*/
    var checkDate=$("#newPhone2_page #date input").val();
    /*姓名为空*/
    if(!name){        
        return false;
    }
    /*身份证号码为空*/
    if(!idCode){        
        return false;
    }
    /*最近检查年月为空*/
    if(!checkDate){        
        return false;
    }
    return true;
}
        /*姓名身份证年月填写*/
$("#newPhone2_page #name input,#newPhone2_page #card input,#newPhone2_page #date input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#newPhone2_page #Button").addClass("disable");
    }else{
        $("#newPhone2_page #Button").removeClass("disable");
    }
})
    /*点击下一步*/
$("#newPhone2_page #Button").unbind("tap").bind("tap",function(){
    if(!noEmpty()){
       tool.pop("请完整填写验证信息"); 
       return false;
    }
});
    /*点击返回登录页*/
$("#newPhone2_page #back").unbind("tap").bind("tap",function(){
    window.location.href="登录注册.html";
});
})();
    /************历史趋势*************/
(function(){
        /*点击返回登录页*/
$("#history_page #back").unbind("tap").bind("tap",function(){
    window.location.href="登录注册.html";
});
})();
    /************个人中心*************/
(function(){
            /*点击修改密码*/
$("#userCenter_page #setKey").unbind("tap").bind("tap",function(){
    window.location.href="忘记密码.html";
});
})();