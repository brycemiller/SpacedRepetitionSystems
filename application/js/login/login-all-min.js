function textField(e,t){var n={fieldLabel:e,name:t,layout:"anchor",xtype:"textfield"};return n}function loginForm(){var e=textField("Password","password");e.inputType="password";var t=new Ext.FormPanel({id:"lf",labelWidth:100,frame:true,title:"Login",bodyStyle:"padding:5px 5px 0",width:400,height:100,defaults:{width:230},items:[textField("Username","username"),e],buttons:[{text:"Log in",iconCls:"silk-door-in",handler:function(){var e=Ext.getCmp("lf");login.login(e.get(0).getValue(),e.get(1).getValue())}}]});return t}function RPC(){var e;var t;this.setMethod=function(e){this.method=e};this.setParams=function(e){this.params=e};this.addParam=function(e,t){if(!this.params)this.params=new function(){};this.params[e]=t}}function ajaxObj(){function e(e,r,i){var s=t();r=JSON.stringify(r);s.finished=false;s.open("POST",e,true);s.onreadystatechange=n(s,i);s.setRequestHeader("Content-Type","application/x-www-form-urlencoded");s.setRequestHeader("X-Requested-With","XMLHttpRequest");s.send("req="+r)}function t(){var e=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest;return e}function n(e,t){return function(){if(e.readyState==4){e.onreadystatechange=null;t(JSON.parse(e.responseText))}}}this.sendRequest=e}function loginObj(){function n(e,t){if(e==""||t=="")return this.showMessage("Please enter both your username and your password");var n=new RPC;n.setMethod("login");n.addParam("username",e);n.addParam("password",hex_md5(hex_md5(t)+chap));this.progress=Ext.MessageBox.progress("Logging in","Logging in...");this.progress.updateProgress(.25,"Sending details to server");ajax.sendRequest("php/login/login.php",n,r(this.progress));this.progress.updateProgress(.5,"Receiving server response");return false}function r(e){return function(t){e.updateProgress(.75,"Managing Reponse");if(t.success=="success"){e.updateProgress(1,"Redirecting to SRS");window.location="srs.php"}else{e.updateProgress(1,"Managing Reponse");chap=t.chap;i(t.message)}}}function i(e){Ext.Msg.show({title:"Oops",msg:e,buttons:Ext.Msg.OK,icon:Ext.MessageBox.WARNING})}var e;var t;this.login=n;this.callBack=r;this.showMessage=i}var ajax=ajax||new ajaxObj;var login=login||new loginObj;loginForm().render("main")