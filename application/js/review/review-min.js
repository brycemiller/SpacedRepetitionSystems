function reviewCallBack(e,t){var n=t.result.card;if(n.length==0){Ext.getCmp("rbt").enable();Ext.getCmp("rpf2").hide();refreshCards();cardGrid.render("rightColumn");return}id=n[0];q=n[1];a=n[2];rpf=reviewPanel(id,q,a);formHandler2(rpf,rpf.getId())()}function review(e){var t=new function(){var t=new Ext.FormPanel({id:"rf",labelWidth:100,frame:true,title:"Review!",bodyStyle:"padding:5px 5px 0",width:495,height:450,defaults:{width:230},items:[comboBox("Review Category","category_id")],buttons:[actionButton("Review","silk-page-go","php/review/reviewStart.php","Fetching Cards","rf",reviewCallBack),{text:"Cancel",iconCls:"silk-cancel",handler:function(){e.enable();Ext.getCmp("rf").hide();cardGrid.show()}}]});return t};return t}function reviewPanel(e,t,n){t='<font size="4">'+t+"</font>";n='<font size="4">'+n+"</font>";var r=new Ext.FormPanel({id:"rpf",labelWidth:100,frame:true,title:"Review!",bodyStyle:"padding:5px 5px 0",width:495,height:450,items:[new Ext.Panel({autoScroll:true,html:t,height:180,width:450}),{xtype:"hidden",name:"a",value:"b"}],buttons:[genericButton("Show Answer","silk-page-go",function(){return showAnswer(e,t,n)},"sab"),actionButton("Later","silk-arrow-refresh","php/review/reviewContinuous.php?instruction=skip","Recycling Card","rpf",reviewCallBack,"recb")]});return r}function reviewPanel2(e,t,n){var r=new Ext.FormPanel({id:"rpf2",labelWidth:100,frame:true,title:"Review!",bodyStyle:"padding:5px 5px 0",width:495,height:450,items:[new Ext.Panel({autoScroll:true,html:t,height:180,width:450}),new Ext.Panel({autoScroll:true,html:n,height:180,width:450}),{xtype:"hidden",name:"a",value:"b"}],buttons:[actionButton("Correct","silk-accept","php/review/reviewContinuous.php?instruction=correct&card_id="+e,"Fetching Next Card","rpf2",reviewCallBack),actionButton("Again","silk-arrow-refresh","php/review/reviewContinuous.php?instruction=wrong&card_id="+e,"Recycling Card","rpf2",reviewCallBack)]});return r}function showAnswer(e,t,n){rpf2=reviewPanel2(e,t,n);formHandler2(rpf2,rpf2.getId())()}