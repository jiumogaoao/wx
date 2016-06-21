	var readFn={}
    $(document).ready(function(){
        $.each(readFn,function(index,fn){
            fn();
        });
    });
    /*干掉默认事件*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    /*是否IE*/
    function isIE(){
        var a = navigator.userAgent;
        if(a.indexOf('MSIE')>-1){
            var N=Number(/\d/.exec(a.split(';')[1]));
            return N;
        }else{
            return false;
        }
    }
    /*自适应处理*/
    function resize(){
    
    var size=function(){
        var w=$(window).width();
    if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
        w=360;
    }
        return w/750;
    };
    var getH=function(){
        if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
            return 1452;
        }else{
            return ($(window).height()/$(window).width())*750;
        }
    }
    if(isIE()&&isIE()<9){
        $("body").css({
        "zoom":"scale("+size()+")",
        "height":getH()+"px"
        });
    }else{
        $("html").css({
        "-webkit-transform":"scale("+size()+")",
        "transform":"scale("+size()+")",
        "height":getH()+"px"
        });
        if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
        $("html").width("200%");
		//$("#all").css("border","2px solid #5b99ec");
		$("#all").css("box-shadow","0px 0px 10px 5px rgba(0,0,0,0.3)");
    }
    }
    
    }
    /*先执行一次*/
    readFn.rs=resize;
    /*屏幕有变动的时候再执行*/
    $(window).on("resize",resize);
    /*滚屏*/
    var scrollArray=[];
    /************通用方法*************/
    (function(){
    /*滚屏*/
    $(".wrap").each(function(){
        var newScroll=new IScroll('#'+$(this).attr("id"), { probeType: 3 });
        scrollArray.push(newScroll);
        $("img").on("load",function(){
    $.each(scrollArray,function(index,sc){
        sc.refresh();
    })
});
    });
     /*显示密码*/
    $(".password .rightIcon").unbind("tap").bind("tap",function(){
        if($(this).parents(".input_module").find("input").attr("type")=="password"){
            $(this).parents(".input_module").find("input").attr("type","text");
            $(this).parents(".input_module").addClass("show");
            $(this).css("color","#333");
        }else{
            $(this).parents(".input_module").find("input").attr("type","password");
            $(this).parents(".input_module").removeClass("show");
            $(this).css("color","#8ea7c8");
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
        if(!tool.phoneCheck(phone)){
            tool.pop("手机号格式有误");
            return false;
        }
        $(this).parents(".input_module").attr("lock","1");
        var that=this;
        var clock=0;
        var url = '';
        if($(this).attr("id") =='forgetsendCode'){
            url = "/用户接口/发送验证码/old";
        }else{
            url = "/用户接口/发送验证码";
        }
        /*先弹图片验证码*/
        tool.picCode(function(code){/*图片验证码通过后发送*/
            $.post(url,{"手机号":phone,"验证码":code},function(json){
            json = eval("("+json+")");
            if(json.状态==200){
                var codeDelay=setInterval(function(){
                    if(clock<60){
                        clock++;
                        $(that).html("重新发送"+(60-clock)+"S");
                        $(that).addClass("disable");
                    }else{
                        $(that).parents(".input_module").attr("lock","0");
                        $(that).html("获取验证码");
                        $(that).removeClass("disable");
                        clearInterval(codeDelay);
                    }
                },1000);

            }else{
                tool.pop(json.状态说明);
                $(that).parents(".input_module").attr("lock","0");
                        $(that).html("获取验证码");
                        $(that).removeClass("disable");
            }
        });

        },function(){
            $(that).parents(".input_module").attr("lock","0");
        });
        
    }); 
    /*往底部*/
    $("#toBottom").unbind("tap").bind("tap",function(){
        $.each(scrollArray,function(index,point){
            point.scrollTo(0,point.maxScrollY,1000);
        });
    });
    /*选年月*/
    $(".input_module .dateSelect.year").unbind("change").bind("change",function(){
        $(this).parents(".input_module").find(".dateInput.year").html($(this).val()+"年");
    });
    $(".input_module .dateSelect.month").unbind("change").bind("change",function(){
        $(this).parents(".input_module").find(".dateInput.month").html($(this).val()+"月");
    });
    })();
    /************工具方法*************/
    var tool = {};
    /*弹出*/
    /*text:弹出内容*/
    /*fn:关闭回调*/
    tool.pop = function(text,fn,buttonName){
        if(!buttonName){
            buttonName="确定";
        }
        $("#pop #popMain").html(text);
        $("#pop #popButton").html(buttonName);
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
        });
    };
    /*获取图片验证码*/
    tool.picCode=function(success,cancel){
        var url="/用户接口/生成图形验证码";/*获取验证码*/
        $("#codePop #codePic").attr("src",url);
        $("#codePop").show();
        $("#popBg").show();
        $("#codePop #popButton").unbind("tap").bind("tap",function(){
            var result=$("#codePop #picCode input").val();
            if(!result){
                return false;
            }
            if(success){
              success(result);  
            }
            $("#codePop").hide();
            $("#popBg").hide();
            $("#codePop #picCode input").val("");
        });
        $("#codePop #codePic").unbind("tap").bind("tap",function(){
            $("#codePop #codePic input").attr("src",url+"?_="+new Date().getTime());
        });
        $("#popBg").unbind("tap").bind("tap",function(){
            if(cancel){
                cancel();
            };
            $("#codePop").hide();
            $("#popBg").hide();
            $("#codePop #picCode input").val("");
        });
    }
    /*验证手机格式*/
    /*text:手机号*/
    tool.phoneCheck = function(text){
        return /^1[3|4|5|7|8]\d{9}$/.test(text);
    }
    /*验证姓名格式*/
    /*text:姓名*/
    tool.nameCheck = function(text){
        if(text.length>=2&&text.length<=8){
            return true;
        }else{
            return false;
        }
    }
    /*验证密码长度*/
    /*text:密码*/
    tool.keyCheck = function(text){
        if(text.length>=6&&text.length<=12){
            return true;
        }else{
            return false;
        }
    }
    /*验证身份证*/
    /*text:身份证号*/
    tool.idCodeCheck = function(text){
        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(text);
    }
    /*图片转码*/
    tool.pic =function(file,fn) {
            var reader = new FileReader();
            reader.onload = function(e) {
                fn(e.target.result);
            };
            reader.readAsDataURL(file.target.files[0]);
        };
    /*下方弹出窗*/
    tool.bottomPop = function(fn,cancel,cancelFn){
		if(cancel){
			$("#popBottom #popBottomCancel").text(cancel);
			}else{
				$("#popBottom #popBottomCancel").text("取消");
				}
        $("#popBottom").show();
        $("#popBottom #popBottomFinish").unbind("tap").bind("tap",function(){
            if(fn){fn()}
            $("#popBottom").hide();   
        });	
		$("#popBottom #popBottomCancel").unbind("tap").bind("tap",function(){
            if(cancelFn){cancelFn()}
            $("#popBottom").hide();   
        });	
    }
    /*loading*/
    tool.loading = {
        on:function(){
            $("#loading").show();
        },
        off:function(){
            $("#loading").hide();
        }
    }
    /************登录*************/
;(function(){
    if(!$("#login_page").length){
        return false;
    }
    $("#loading").hide();
        /*登录注册切换*/
    function L2R(page){
        $(".nav_module .line").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate("+page*100+"%, 0px)",
                    "-webkit-transform":"translate("+page*100+"%, 0px)"
        });
        $("#login_page #pageRoll").css({
                    "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    "transition-duration": "1000ms",
                    "transform":"translate(-"+page*750+"px, 0px)",
                    "-webkit-transform":"translate(-"+page*750+"px, 0px)"
        });
    }
	/*向左划*/
	$("#login_page").unbind("swipeleft").bind("swipeleft",function(){
		L2R(1);
		});
	/*向右划*/
	$("#login_page").unbind("swiperight").bind("swiperight",function(){
		L2R(0);
		});
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
    if(!tool.phoneCheck($("#login_page #loginPhone input").val())){
            tool.pop("请输入11位手机号码");
            return false;
        }
    if(!tool.keyCheck($("#login_page #loginKey input").val())){
            tool.pop("密码有误");
            return false;
        }
    var phone=$("#loginPhone input").val();
    var key=$("#loginKey input").val();
    tool.loading.on();
    $.post('/用户接口/登录检验', {"手机":phone,"密码":key}, function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href=json.数据.跳转地址;
        }else{
            tool.pop(json.状态说明);
        }

    },function(){
        tool.loading.on();
        tool.pop("网络连接失败");
    });
});
    /*点击忘记密码*/
$("#login_page #forgetKey").unbind("tap").bind("tap",function(){
    window.location.href="/用户/忘记密码";
});
    /*点击旧号不用的*/
$("#login_page #new").unbind("tap").bind("tap",function(){
    window.location.href="/用户/更换手机号";
});
})();
    /************注册*************/
(function(){
    if(!$("#login_page").length){
        return false;
    }
    $("#loading").hide();
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
    if(!tool.phoneCheck($("#login_page #registPhone input").val())){
            tool.pop("请输入11位手机号码");
            return false;
        }
    if(!tool.keyCheck($("#login_page #registKey input").val())){
            tool.pop("请输入6~12位英文或数字");
            return false;
        }
    var obj = {}
    obj.手机号 = $("#login_page #registPhone input").val();
    obj.验证码 = $("#login_page #registCode input").val();
    obj.密码 = $("#login_page #registKey input").val();
    tool.loading.on();
    $.post("/用户接口/注册第一步",{"数据":obj},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href="/用户/注册第二步/";
        }else{
            tool.pop(json.状态说明);
        }
    });


});
})();
    /************注册第二步*************/
(function(){
    if(!$("#regist2_page").length){
        return false;
    }
    $("#loading").hide();
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
    if(!tool.nameCheck($("#regist2_page #name input").val())){
        tool.pop("请输入真实名字"); 
       return false;
    }
    if(!tool.idCodeCheck($("#regist2_page #card input").val())){
        tool.pop("请输入真实身份证号"); 
       return false;
    }
    var name = $("#regist2_page #name input").val();
    var idcard = $("#regist2_page #card input").val();
    tool.loading.on();
    $.post("/用户接口/注册",{"姓名":name,"身份证":idcard},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href=json.数据.跳转地址;
        }else{
            tool.pop(json.状态说明);
        }
    });
});
})();
    /************忘记密码*************/
(function(){
    if(!$("#forgetKey_page").length){
        return false;
    }
    $("#loading").hide();
        /*非空验证*/
    function noEmpty(){
    /*手机号码*/
    var phone=$("#forgetKey_page #forgetPhone input").val();
    /*验证码*/
    var code=$("#forgetKey_page #forgetCode input").val();
    /*手机号*/
    if(!phone){        
        return false;
    }
    /*验证码*/
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
    if(!tool.phoneCheck($("#forgetKey_page #forgetPhone input").val())){
            tool.pop("请输入11位手机号码");
            return false;
        }
    var obj = {}
    obj.手机号 = $("#forgetKey_page #forgetPhone input").val();
    obj.验证码 = $("#forgetKey_page #forgetCode input").val();
    tool.loading.on();
    $.post('/用户接口/验证手机/old',{"数据":obj},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href="/用户/更换手机号2";
        }else{
            tool.pop(json.状态说明);
        }
    });
});
    /*点击返回登录页*/
$("#forgetKey_page #back").unbind("tap").bind("tap",function(){
    window.location.href="/用户/登录";
});
})();
    /************更换手机号*************/
(function(){
    if(!$("#newPhone_page").length){
        return false;
    }
    $("#loading").hide();
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
    if(!tool.phoneCheck($("#newPhone_page #newPhonePhone input").val())){
            tool.pop("请输入11位手机号码");
            return false;
        }
    var obj = {}
    obj.手机号 = $("#newPhone_page #newPhonePhone input").val();
    obj.验证码 = $("#newPhone_page #newPhoneCode input").val();
    tool.loading.on();
    $.post('/用户接口/验证手机',{"数据":obj},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href="/用户/更换手机号2";
        }else{
            tool.pop(json.状态说明);
        }
    });
});
    /*个人中心-更换手机*/
    $("#newPhone_page #resetnewPhoneButton").unbind("tap").bind("tap",function(){
        if(!tool.phoneCheck($("#newPhone_page #newPhonePhone input").val())){
            tool.pop("请输入11位手机号码");
            return false;
        }
        var obj = {}
        obj.手机号 = $("#newPhone_page #newPhonePhone input").val();
        obj.验证码 = $("#newPhone_page #newPhoneCode input").val();
        tool.loading.on();
        $.post('/用户接口/验证手机/login',{"数据":obj},function(json){
            tool.loading.off();
            json = eval("("+json+")");
            if(json.状态==200){
                window.location.href="/用户/首页";
            }else{
                tool.pop(json.状态说明);
            }
        });
    });
    /*点击返回登录页*/
$("#newPhone_page #newPhoneback").unbind("tap").bind("tap",function(){
    window.location.href="/用户/登录";
});
})();
    /************更换手机号2*************/
(function(){
    if(!$("#newPhone2_page").length){
        return false;
    }
    $("#loading").hide();
    /*加入前10年选项*/
    var yearOption=[];
    var year=new Date().getFullYear();
    for(var i = year-10;i<=year;i++){
		var selected = false;
		if(i==year){
			selected = true;
			}
        yearOption.push({label:i+"年",value:i,selected:selected});
    }
    /*12个月*/
    var moonOption=[];
    for(var i = 1;i<=12;i++){
        var str=i;
        if(i<10){
            str="0"+i;
        }
		var selected=false;
		if(i==new Date().getMonth()+1){
			selected=true
			}
        moonOption.push({label:str+"月",value:str,selected:selected});
    }
  var dropDown=new phoneSelect("#popBottomMain",2);
  var dateResult=[];
  dropDown.callback=function(result){
    dateResult=result.result;
  }
  dropDown.set(0,yearOption);
  dropDown.set(1,moonOption);
    /*非空验证*/
    function noEmpty(){
    /*姓名*/
    var name=$("#newPhone2_page #name input").val();
    /*身份证号码*/
    var idCode=$("#newPhone2_page #card input").val();
    /*最近检查年月*/
    var checkDate=$("#newPhone2_page #date .dateFrame").attr("value");

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
        //return false;
    }
    return true;
}
        /*姓名身份证年月填写验证*/
$("#newPhone2_page #name input,#newPhone2_page #card input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#newPhone2_page #Button").addClass("disable");
    }else{
        $("#newPhone2_page #Button").removeClass("disable");
    }
})
    /*选择最近体检年月*/
$("#newPhone2_page #date").unbind("tap").bind("tap",function(){
    tool.bottomPop(function(){
        $("#newPhone2_page #date .dateFrame").attr("value",dateResult[0]+dateResult[1]);
        $("#newPhone2_page #date .dateFrame").html(dateResult[0]+"年"+dateResult[1]+"月");
    },"最近没体检",function(){
		$("#newPhone2_page #date .dateFrame").attr("value",0);
        $("#newPhone2_page #date .dateFrame").html("0");
		});
});
    /*点击下一步*/
$("#newPhone2_page #Button").unbind("tap").bind("tap",function(){

    if(!noEmpty()){
       tool.pop("请完整填写验证信息"); 
       return false;
    }
    if(!tool.idCodeCheck($("#newPhone2_page #card input").val())){
        tool.pop("身份证格式有误"); 
       return false;
    }
    var obj = {}
    obj.姓名 = $("#newPhone2_page #name input").val();
    obj.身份证号 = $("#newPhone2_page #card input").val();
    obj.最近体检时间 = $("#newPhone2_page #date .dateFrame").attr("value");
    tool.loading.on();
    $.post('/用户接口/更新新手机',{"数据":obj},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href="/用户/重置密码";
        }else{
            tool.pop(json.状态说明);
        }
    });
});
    /*点击返回登录页*/
$("#newPhone2_page #back").unbind("tap").bind("tap",function(){
    window.location.href="/用户/登录";
});
})();
    /************历史趋势*************/
(function(){
    if(!$("#history_page").length){
        return false;
    }
    $("#loading").hide();
    /*点击返回登录页*/
$("#history_page #back").unbind("tap").bind("tap",function(){
    window.location.href="/用户/登录";
});
})();
    /************个人中心*************/
(function(){
    if(!$("#userCenter_page").length){
        return false;
    }
    var change=0;
    var result={};
    var sex = {};
    sex["男"]="/assets/images/head.png";
    sex["女"]="/assets/images/gHead.png";
    /*填数据*/
    tool.loading.on();
    $.ajax(
        {
        url:"/用户接口/个人中心",
                            dataType:"json",
                            type: "POST",
                            data:{},
                            error:function(e){
                                tool.loading.off();
                                error(e);
                                },
                            success: function(returnData){
                                tool.loading.off();
                                $("#loading").hide();
                                         result = returnData["数据"] ;
                                         var tu="/assets/images/head.png";
                                         if(result["头像"]){
                                            tu=result["头像"];
                                         }else if(result["性别"]){
                                            tu=sex[result["性别"]];
                                         }
                                         $("#userCenter_page [data_type='images'][data_name='头像']").attr("src",tu);
                                         $.each(result,function(index,point){
                                            $("#userCenter_page [data_type='text'][data_name='"+index+"']").html(point);
                                            $("#userCenter_page [data_type='input'][data_name='"+index+"']").val(point);
                                         })   
                                }
    }
        );
    /*改数据*/
    $("#userCenter_page [data_type='input']").unbind("keydown").bind("keydown",function(){
        change=1;
    });
    $("#userCenter_page [data_type='input']").unbind("change").bind("change",function(){
        result[$(this).attr("data_name")]=$(this).val();
    });
    /*点击编辑信息*/
$("#userCenter_page #edit").unbind("tap").bind("tap",function(){
    if($("#userCenter_page").attr("edit")=="0"){
        $("#userCenter_page").attr("edit","1");
        $("#userCenter_page").addClass("edit");
        $("#userCenter_page #edit .text").html("完成");
        $("#userCenter_page .canEdit input,#userCenter_page .canEdit textarea").each(function(){
            this.removeAttribute("readonly");
        });
        change=0;
    }else{
        $("#userCenter_page").attr("edit","0");
        $("#userCenter_page").removeClass("edit");
        $("#userCenter_page #edit .text").html("编辑信息");
        $("#userCenter_page .canEdit input,#userCenter_page .canEdit textarea").each(function(){
            $(this).attr("readonly","readonly");
        });
        var obj = {};
        obj.身高 =  $("#userCenter_page").find("#height").val();
        obj.体重 =  $("#userCenter_page").find("#weight").val();
        obj.住址 =  $("#userCenter_page").find("#address").val();
        obj.紧急联系人 =  $("#userCenter_page").find("#linkman").val();
        obj.紧急联系人电话  =  $("#userCenter_page").find("#linkphone").val();
        if(!change){
            return false;
        }
        tool.loading.on();
        $.post('/用户接口/信息更新', {"更新数据":obj}, function(json){
            tool.loading.off();
            json = eval("("+json+")");
            if(json.状态==200){
                tool.pop("更新成功");
            }else{
                tool.pop(json.状态说明);
            }
        },function(){
            tool.pop("网络连接失败");
        });
    }
});
    /*点击修改密码*/
$("#userCenter_page #setKey").unbind("tap").bind("tap",function(){
    window.location.href="/用户/重置密码";
});
    /*点击手机号*/
$("#userCenter_page #changePhone").unbind("tap").bind("tap",function(){
    window.location.href="/用户/更换手机号/login";
});
   /*点击体检报告*/
$("#userCenter_page #goCheck").unbind("tap").bind("tap",function(){
    $(this).addClass("active");
    window.location.href="/用户/体检报告";
});
   /*点击下载APP*/
$("#userCenter_page #download").unbind("tap").bind("tap",function(){
    $(this).addClass("active");
    window.location.href="/用户/历史趋势";
});
function savePic(id){
wx.uploadImage({
    localId: id[0], // 需要上传的图片的本地ID，由chooseImage接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: function (res) {
        var serverId = res.serverId; // 返回图片的服务器端ID
        tool.loading.on();
        $.post('/用户接口/头像', {"图片":serverId}, function(json){
            tool.loading.off();
            json = eval("("+json+")");
            if(json.状态==200){
                
            }else{
                tool.pop(json.状态说明);
            }
        });
    }
});
}
$("#userCenter_page #userHead").unbind("tap").bind("tap",function(){
    wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        $("#userCenter_page #userHead").attr("src",localIds);
        savePic(localIds);
    }
});
})
})();
/************重置密码*************/
(function(){
    if(!$("#resetKey_page").length){
        return false;
    }
    $("#loading").hide();
/*非空验证*/
function noEmpty(){
    /*密码*/
    var key=$("#resetKey_page #loginKey input").val();
    /*密码为空*/
    if(!key){
        return false;
    }
    return true;
}
    /*手机号验证码密码填写*/
$("#resetKey_page #loginKey input").unbind("change").bind("change",function(){
    if(!noEmpty()){
        $("#resetKey_page #resetButton").addClass("disable");
    }else{
        $("#resetKey_page #resetButton").removeClass("disable");
    }
})
    /*点击重设密码*/
$("#resetKey_page #resetButton").unbind("tap").bind("tap",function(){
    if(!tool.keyCheck($("#resetKey_page #loginKey input").val())){
            tool.pop("请输入6~12位英文或数字");
            return false;
        }
    var password = $("#resetKey_page #loginKey input").val();
    tool.loading.on();
    $.post("/用户接口/设置新密码",{"密码":password},function(json){
        tool.loading.off();
        json = eval("("+json+")");
        if(json.状态==200){
            window.location.href="/用户/登录";
        }else{
            tool.pop(json.状态说明);
        }
    },function(){
        tool.loading.off();
        tool.pop("网络连接失败");
    });
});
        /*点击返回登录页*/
$("#resetKey_page #back").unbind("tap").bind("tap",function(){
    window.location.href="/用户/登录";
});
})();
/************体检报告*************/
(function(){
    if(!$("#report_page").length){
        return false;
    }
    var shareCode = $("#shareCode").val();
    if(shareCode){

        var code = shareCode;
        var share = 'shareCode';
    }else{
        var code = 0;
        var share = '';
    }
    var getting=false;
    function getData(){
        /*填数据*/
        tool.loading.on();
    $.ajax(
        {
        url:"/用户接口/体检报告/"+code+'/'+share,
                            dataType:"json",
                            type: "POST",
                            cache:false,
                            data:{},
                            error:function(e){
                                tool.loading.off();
                                error(e);
                                },
                            success: function(returnData){
                                tool.loading.off();
                                        getting=false;
                                        if(!returnData["状态"]){
                                            tool.pop("网络连接有误");
                                        }else if(returnData["状态"]==200){
                                             $("#report_page .result").removeClass("bar_danger_min");
                                            $("#report_page .result").removeClass("bar_danger_max");
                                            $("#report_page .result").removeClass("bar_abnormal_min");
                                            $("#report_page .result").removeClass("bar_abnormal_max");
                                            $("#report_page .result").removeClass("bar_normal");
                                            var result = returnData["数据"] ;
                                            if(!shareCode){
                                                code = result["体检记录编号"];
                                            }
                                         $.each(result,function(index,point){
                                            $("#report_page [data_type='text'][data_name='"+index+"']").html(point);
                                         });
                                         var main= result["类型数据"];
                                         $("#report_page #BMI .number").html(main["BMI"]);
                                         $("#report_page #xl .number").html(main["心率"]);
                                         $("#report_page #ssy .number").html(main["收缩压"]);
                                         $("#report_page #szy .number").html(main["舒张压"]);
                                         $("#report_page #kfxt .number").html(main["空腹血糖"]);
                                         //$("#report_page #thxhdb .number").html(main["糖化血红蛋白"]);
                                         //$("#report_page #dmx .number").html(main["动脉血"]);
                                         $("#report_page #jmx .number").html(main["静脉血氧"]);
                                         $("#report_page #BMI .result").addClass(text2class[main["BMI状态"]]);
                                         $("#report_page #xl .result").addClass(text2class[main["心率状态"]]);
                                         $("#report_page #ssy .result").addClass(text2class[main["收缩压状态"]]);
                                         $("#report_page #szy .result").addClass(text2class[main["舒张压状态"]]);
                                         $("#report_page #kfxt .result").addClass(text2class[main["空腹血糖状态"]]);
                                         //$("#report_page #thxhdb .result").addClass(text2class[main["糖化血红蛋白状态"]]);
                                         //$("#report_page #dmx .result").addClass(text2class[main["动脉血状态"]]);
                                         $("#report_page #jmx .result").addClass(text2class[main["静脉血氧状态"]]);
                                         $.each(main,function(index,point){
                                            $("#report_page [data_type='text'][data_name='"+index+"']").html(point);
                                         })
                                        }else{
                                            tool.pop(returnData["状态说明"]);
                                        }        
                                }
    }
        );
    }
    scrollArray[0].on('scroll', function(){
        if(this.y.toFixed(0)>100&&!getting){
            //getting=true;
            //getData();
            window.location.reload();
        }
    });
    $("#loading").hide();
    var text2class={};
    text2class["危险-低"]="bar_danger_min";
    text2class["危险-高"]="bar_danger_max";
    text2class["异常-低"]="bar_abnormal_min";
    text2class["异常-高"]="bar_abnormal_max";
    text2class["正常"]="bar_normal";
    getData();
    $("#goecg").unbind("tap").bind("tap",function(){
        tool.pop("心电图数据是app的特有功能，快去下载吧 O(∩_∩)O",function(){
            window.open("/用户/软件下载");
        },"下载app");
    })
    })();
/************分享信息*************/
(function(){
    if(!$("#share_page").length){
        return false;
    }
    $("#down").unbind("tap").bind("tap",function(){
        window.location.href = '/用户/软件下载';
    });
    $("#loading").hide();
    readFn.anDelay=function(){
       var aDelay=setTimeout(function(){
        $("#share_page").addClass("run");
    },1000); 
    };
    
})();
/****兼容****/
var brower = {
    versions:function(){
      var u = window.navigator.userAgent;
      var num ;
      if(u.indexOf('Mobile') > -1){
        //移动端
        if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
          //android
          num = u.substr(u.indexOf('Android') + 8, 3);
          return {"type":"Android", "version": num};
        }else{
          return false;
        }
      }else{return false};
    }
  }

if(brower.versions()&&brower.versions().version){
  var v=brower.versions().version.split(".");
  if(Number(v[0])<=4&&Number(v[1])<4){
        $("body").append('<style>'+
'#codePop #picCode input{ '+
'padding:40px;'+
'font-size: 40px;'+
'line-height: 40px;'+
'} '+
    '</style>')
  }
}
