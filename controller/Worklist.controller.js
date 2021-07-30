/*global location history */
sap.ui.define([
		"MTK/ZUMPUP0001/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"jquery.sap.global",
		"MTK/ZUMPUP0001/model/formatter",
	], function (BaseController, JSONModel,Filter, jQuery, formatter) {
		"use strict";

		return BaseController.extend("MTK.ZUMPUP0001.controller.Worklist", 
		{

		_cpm:[],
		_bkm:[],
		_pym:[],
		_vendorid:"",
		_workid:"",
		_role:"",
		_scenario:"",
		_status:"",
		_user_id:"",
		formatter: formatter,
		onInit : function () 
		{
			
			if( window.location.href.search("localhost") < 0 ) 
			{
				this._vendorid = this.getParameterByName("vendor_id");
				this._role =  this.getParameterByName("role");
				this._scenario =  this.getParameterByName("scenario");
				this._status =  this.getParameterByName("status");	
				this._user_id = this.getParameterByName("user_id");
//0706 Add				
				this._company = this.getParameterByName("company");  
			}	
			
		 	this.initJson();
		 	this.initVhVat();
	    	this.readData();
	        this.initMessage();
			
		},
			
		onSave:function(oEvent)
		{
			this.oMessagePopover.close();
			var oDataData = oEvent.getSource().getParent().getModel("cData");
			var oDataObject = oEvent.getSource().getParent().getModel();
			if ( this.checkScreenData() )
			{
				this.getView().setBusyIndicatorDelay(0);
				this.getView().setBusy(true);	
					
			   oDataData =	this.setFilename(oDataData);
			   oDataData = this.beforeSend(oDataData, "SAVE");
			   this.sendData(oDataObject, oDataData);	
			}
		},
		
		onSubmit:function(oEvent)
		{

		this.oMessagePopover.close();
		var oDataData = oEvent.getSource().getParent().getModel("cData");
			var oDataObject = oEvent.getSource().getParent().getModel();
			
			
			if ( this.checkScreenData() )
			{

				sap.m.MessageBox.warning(this.i18n("You_can_not_change_the_data_after_submit,\n_Continue_perform_function?"),
				{
					title: "Warning",
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					emphasizedAction: sap.m.MessageBox.Action.OK,
					onClose: function (sAction) 
					{
						if ( sAction === sap.m.MessageBox.Action.OK )
						{
						
					      this.getView().setBusyIndicatorDelay(0);
					      this.getView().setBusy(true);	
						  oDataData =	this.setFilename(oDataData);
						  oDataData = this.beforeSend(oDataData, "SUBMIT");
						  this.sendData(oDataObject, oDataData);	
							 
						}
					}.bind(this)
				}
				);
			
			
		}
		},
		
		onWrite:function(oEvent)
		{
			this.oMessagePopover.close();
			var oDataData = oEvent.getSource().getParent().getModel("cData");
			var oDataObject = oEvent.getSource().getParent().getModel();
			if ( this.checkScreenData() )
			{
				
				this.getView().setBusyIndicatorDelay(0);
				this.getView().setBusy(true);			
			   oDataData =	this.setFilename(oDataData);
			   oDataData = this.beforeSend(oDataData, "SAP");
			   this.sendData(oDataObject, oDataData);	
			}			
		},
		
		onCancel:function(oEvent)
		{
			var oDataData = oEvent.getSource().getParent().getModel("cData");
			var oDataObject = oEvent.getSource().getParent().getModel();

			this.oMessagePopover.close();
			sap.m.MessageBox.warning(this.i18n("The_create_vendor_process_will_be_canceled,\n_continue_perform_function?"), 
			{
				title: "Warning",
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				emphasizedAction: sap.m.MessageBox.Action.OK,
				onClose: function (sAction) 
				{
					if ( sAction === sap.m.MessageBox.Action.OK )
					{
						 
					   oDataData =	this.setFilename(oDataData);
					   oDataData = this.beforeSend(oDataData, "CANCEL");
					   this.sendData(oDataObject, oDataData);							 
						 
					}
				}.bind(this)
			}
			);			
			
		
		},
		
		onClose:function(oEvent)
		{
			
			var oData =	this.getView().getModel("cData").getProperty("/disp");
				
			if ( ( oData.status === "02" && this._role === "BUYER" )  ||  ( oData.status === "03" && this._role === "FIN" ) )
			{
				sap.m.MessageBox.warning(this.i18n("You_have_not_import_the_vendor_into_SAP_system,\n_Do_you_want_to_close_the_window?"), 
				{
				title: "Warning",
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				emphasizedAction: sap.m.MessageBox.Action.OK,
				onClose: function (sAction) 
				{
					if ( sAction === sap.m.MessageBox.Action.OK )
					{
//20210617 Add						
						var win = window.open("about:blank", "_self");
            			win.close();
//20210617 End            			
						 window.close();
					}
				}
				}
				);
			}	
			else
			{
//20210617 Add				
				var win = window.open("about:blank", "_self");
        		win.close();
//20210617 End         		
				 window.close();
			}
			
		},
///20210625 checkcode		
		onCheckClose:function(oEvent)
		{
			
			var Code = this.getView().getModel("cData").getProperty("/disp/checkcode");
			var inputCode = this.getView().getModel("cData").getProperty("/checkcode");
			
			if ( Code === inputCode )
			{
				
			this._CheckcodeDialog.close();	
			this._checked = true;
			this.readData();
	        this.initMessage();
				
			}
			
			else
			{
				this.onClose();
			}
			
//			var idCode = sap.ui.getCore().byId("CheckcodeFragment--code").getValue();
//			this._vhID = oEvent.getSource().getId();
//					if ( this._vhID !== Code )
//					{
//						window.close();
//					}
//					else
///					{
//						this._CheckcodeDialog.close();
//					}
	
		},
///20210625 checkcode end		
		onLogClose:function(oEvent)
		{
			
	
			this._ChangeLogDialog.close();
		},
		
		onChglog:function(oEvent)
		{
			
				
				if (!this._ChangeLogDialog) 
				{
					this._ChangeLogDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.ChangeLog", this);
					this.getView().addDependent(this._ChangeLogDialog);
				}
						
				var andFilter = [];
				var orFilter = [];
				var oVendor_id = this.getView().getModel("cData").getProperty("/disp/vendor_id");
				orFilter.push(new sap.ui.model.Filter("vendor_id", "EQ",  oVendor_id ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				
				var oBinding = this._ChangeLogDialog.getContent()[1].getBinding("rows");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));	
				// var oBinding = this._ChangeLogDialog.getBinding("vendor_id");
				// oBinding.filter(new sap.ui.model.Filter(andFilter, true));
				
			
				this._ChangeLogDialog.open();		
			
		},
	

		onApphisClose:function(oEvent)
		{
			
			this._ApphisDialog.close();

		},		
		
		onApphis:function(oEvent)
		{
				
				if (!this._ApphisDialog) 
				{
					this._ApphisDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.Apphis", this);
					this.getView().addDependent(this._ApphisDialog);
				}
				var oVendor_id = this.getView().getModel("cData").getProperty("/disp/vendor_id");
				var andFilter = [];
				var orFilter = [];
				
				orFilter.push(new sap.ui.model.Filter("vendor_id", "EQ" , oVendor_id ));
				orFilter.push(new sap.ui.model.Filter("field", "EQ"  , "STATUS"));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				// orFilter = [];
				
				var oBinding = this._ApphisDialog.getContent()[1].getBinding("rows");
				oBinding.filter(new sap.ui.model.Filter(orFilter, true));
			
			
			
				this._ApphisDialog.open();
				
				
		},
		
	
		
		onRemail:function(oEvent)
		{
			
			var oDataData = oEvent.getSource().getParent().getModel("cData");
			var oDataObject = oEvent.getSource().getParent().getModel();
			if ( this.checkScreenData() )
			{
					
			   oDataData =	this.setFilename(oDataData);
			   oDataData = this.beforeSend(oDataData, "EMAIL");
			   this.sendData(oDataObject, oDataData);	
			}			
		},
		
		checkScreenData:function()
		{
			this._oMessageManager.removeAllMessages();
			var aMockMessages = [];	
			var ck = this.getView().getControlsByFieldGroupId("checkInputs");
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;			
			var oData= 	 this.getView().getModel("cData").getProperty("/disp");
			
			for(var i = 0; i < ck.length; i++)
			{
				
			    
				if( ck[i].getMetadata().getElementName() !== "sap.m.Input" ) 
				{
					continue;
				}
				else
				{
					ck[i].setValueState(sap.ui.core.ValueState.None);
				}
			
				if( ck[i].getVisible() !== true ||
				    ck[i].getEditable() !== true )
				{
					continue;
				}
				
				var subGrp = ck[i].getFieldGroupIds()[2]; 
				if ( ck[i].getFieldGroupIds()[0] === "tr" &&
				     this.getView().byId("acc_groups").getValue() === "Z003" )
				{
					continue;
				}  
				
				if ( ck[i].getFieldGroupIds()[0] === "tr" &&
				     this._scenario !== "BY_BUYER" )
				{
				   continue;	
				} 
				
				
				
				if( subGrp && ck[i].getFieldGroupIds()[0] === "tr" )
				{  
					if ( this._cpm.indexOf(subGrp) < 0 )
					{
						continue;
					}
				}
				if ( subGrp && ck[i].getFieldGroupIds()[0] === "bk" )
				{
					if ( this._bkm.indexOf(subGrp) < 0 )
					{
						continue;
					}					
				}
				if ( subGrp && ck[i].getFieldGroupIds()[0] === "py" )
				{
					if ( this._pym.indexOf(subGrp) < 0 )
					{
						continue;
					}
				}	
				
				
			//若company = MUS1,且Is Check Payment V: 不需檢查Bank 資料必填
				//>>>20210615
				if( oData.company === "MUS1" && 
				    oData.bkcheck_pay === true  )
				{
					
					if(  ck[i].getFieldGroupIds()[2] === "bk01" ||
						 ck[i].getFieldGroupIds()[2] === "bk02" ||
						 ck[i].getFieldGroupIds()[2] === "bk03" 
					   )
					  
					  {
					  	continue;
					  } 
					
				}
				//<<<20210615						
				
				var ckId = ck[i].getId();
				var ckValue = ck[i].getValue();
				if ( ck[i].getRequired() && ckValue === ""   )
				{
					
			    	var lableTxt =	ck[i].getLabels()[0].getText();

					var aMsg =
					{
						type: "Error",
						title: this.i18n("Please_input_require_field"),
						description: lableTxt +  this.i18n("is_require_field"),
						subtitle: lableTxt +  this.i18n("is_require_field"),
						controlTab: "",
						controlIds: ""
					};

					aMsg.controlTab = ck[i].getFieldGroupIds()[0]; 
					aMsg.controlIds = ckId;
					aMockMessages.push(aMsg);	
				}
				else if( ckId.search("mail") >= 0 && ckValue !== "" && !mailregex.test(ckValue) )
				{
						var bMsg =
						{
							type: "Error",
							title: this.i18n("Please_check_email_format"),
							description: lableTxt + this.i18n("is_email_field"),
							subtitle:  lableTxt + this.i18n("is_email_field") ,
							controlTab: "",
							controlIds: ""
						};
	
						bMsg.controlTab = ck[i].getFieldGroupIds()[0];
						bMsg.controlIds = ckId;
						aMockMessages.push(bMsg);				
					
				}
				else
				{
					ck[i].setValueState(sap.ui.core.ValueState.None);	
				}
				
			}	
			
/////////////checkAttachment/////////////////////////////////////////////			
			var cAttachItems = this.getView().byId("UploadSet").getItems();
			var allfileName=[];
		//	var allfileType=[];
			
			for( i = 0; i < cAttachItems.length; i++ )
			{
				var attachStats = cAttachItems[i].getStatuses();
				var attachFilename = cAttachItems[i].getFileName();
				
			    if(  allfileName.indexOf(attachFilename) >= 0 )
			    {
			    	
					var bMsg =
						{
							type: "Error",
							title: this.i18n("Please_check_upload_file_name"),
							description: this.i18n("Duplicate_file_name") + attachFilename,
							subtitle: this.i18n("Upload_name_error") ,
							controlTab: "",
							controlIds: ""
						};
	
						bMsg.controlTab = "att";
						bMsg.controlIds = ckId;
						aMockMessages.push(bMsg);		
			    	
			    	continue;
			    }
			    else
			    {
			    	allfileName.push(attachFilename);
			    }
			     var attachfiletype = "";
				if ( cAttachItems[i].getAttributes().length >= 1 )
				{
				  attachfiletype =	cAttachItems[i].getAttributes()[0].getText();
				  
				}
				
	//			if ( attachfiletype !== "" )
	//			{
	//				if(  allfileType.indexOf(attachfiletype) >= 0 )
	//				{
	//					
	//				var bMsg =
	//					{
	//						type: "Error",
	//						title: "Please check upload file type",
	//						description: "Duplicate file type" + attachfiletype,
	//						subtitle:  "Upload file type error" ,
	//						controlTab: "",
	//						controlIds: ""
	//					};
	//
	//					bMsg.controlTab = "att";
	///					bMsg.controlIds = ckId;
	//					aMockMessages.push(bMsg);								
	//					
	//				}
	//				else
	//				{
	//					allfileType.push(attachfiletype);
	//				}
	//				
	//			}
				
				if ( (  attachStats.length > 0 &&  attachStats[0].getState() === "Error" ) ||
				   ( attachfiletype === "" ) )
				  
				{
					
					var bMsg =
						{
							type: "Error",
							title: this.i18n("Please_check_upload_file_type"),
							description: this.i18n("Please_select_upload_file_type_for_filename") + attachFilename,
							subtitle:  this.i18n("Upload_type_error") ,
							controlTab: "",
							controlIds: ""
						};
	
						bMsg.controlTab = "att";
						bMsg.controlIds = ckId;
						aMockMessages.push(bMsg);							
				}
			}
			
			
			if	( aMockMessages.length > 0 )
			{
			var oModel = new JSONModel();
			oModel.setData(aMockMessages);
			this.getView().setModel(oModel, "message");
			
			var oButton = this.getView().byId("msgpopover");
				setTimeout( function()
				{
					this.oMessagePopover.openBy(oButton);
				}.bind(this), 1000);
			return false;	
			}
			else
			{
				return true;
			}
			
			
		},

		readData:function()
		{
		
		
			this.getView().setBusy(true);	
			var oModel = this.getOwnerComponent().getModel();
			var cWhere = [ new Filter("vendor_id", "EQ", this._vendorid)];	
//20210623c Add
			var aWhere = [ new Filter("buyer_name", "EQ", this._user_id) ];
			
		
//20210622 Add
			oModel.setHeaders({"X-Requested-With" : "X"});
//20210622 end	
//20210623c Add

			if  ( ( this._role === "VENDOR" && this._checked === true) ||  this._role !== "VENDOR" )
			{
				
			oModel.read("/ZI_Vendor_userinfo", 
			{
			 filters: aWhere,//andFilter,	
			 success: function(fData)
			 {
//20210709 Add			 	
			 	if (fData.results && fData.results.length)
			 	{			 	
			 	this.getView().getModel("cData").setProperty("/info", fData.results[0]);
			 	}
//			 	this.refreshDisplay();
			 }.bind(this)
			}
			);	
			
			}
//20210623c end	

			oModel.read("/ZI_Vendor_data", 
			{
			 filters: cWhere,	
			 success: function(aData) 
			 {
//20210625Add			 	
			  if ( this._role === "VENDOR" && this._checked !== true)	
			  {

			 	this.getView().getModel("cData").setProperty("/disp/checkcode", aData.results[0].checkcode);
			  	this._CheckcodeDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.Checkcode", this);
				this.getView().addDependent(this._CheckcodeDialog);
			
				this._CheckcodeDialog.open();
			  }
			  
//20210625End	
			if  ( ( this._role === "VENDOR" && this._checked === true) ||  this._role !== "VENDOR" )
				{
			 	this.getView().getModel("cData").setProperty("/disp", aData.results[0]);
				this.readAttach(oModel, cWhere);
				this.readRule(oModel, aData.results[0]);
				this.readWorkid(oModel);
				this.setDefaultData();
		 		this.refreshDisplay();
		 		
				}
			 }.bind(this)
			}
			);
			
			
			
			
				if  ( ( this._role === "VENDOR" && this._checked === true) ||  this._role !== "VENDOR" )
			{			
				oModel.read("/ZI_Vendor_desc", 
				{
				 filters: cWhere,	
				 success: function(aData) 
				 {
				 	
				 	this.getView().getModel("cData").setProperty("/desc", aData.results[0]);
				 	
//20210709 insert timeout delay refresh				 	
				 	setTimeout( function()
					 {
						this.refreshDisplay();
					 }.bind(this), 1000);
				 	
				 }.bind(this)
				}
				);
			
			}
			
		},
	
		
		readRule:function(oModel, aData)
		{
		   	
			var andFilter = [];
			var orFilter = [];
			orFilter.push(new sap.ui.model.Filter("role", "EQ", this._role));
			andFilter.push(new sap.ui.model.Filter(orFilter, false));
			orFilter = [];
			orFilter.push(new sap.ui.model.Filter("status", "EQ", aData.status));
			andFilter.push(new sap.ui.model.Filter(orFilter, false));	  	
		   	
			orFilter = [];
			orFilter.push(new sap.ui.model.Filter("submitted", "EQ", aData.submitted));
			andFilter.push(new sap.ui.model.Filter(orFilter, false));	 		   	
		   	
		   	
			oModel.read("/ZI_Vendor_rule", 
			{
			 filters: andFilter,
			 success: function(aRule) 
				{
				this.getView().getModel("cData").setProperty("/rule", aRule.results[0]);	
				}.bind(this)
			}
			);			
		},
		
		setDefaultData: function()
		{
			
			var oRule = this.getView().getModel("cData").getProperty("/rule");
			var oViewModel = this.getView().getModel("cView");
		    var editable = "";
		    var visible = "";
		    var enable = "";
 //20210714 Add
			var oModel = this.getOwnerComponent().getModel();
			var oCompany =	this.getView().getModel("cData").getProperty("/disp/company");
			var bWhere = [ new Filter( "id", "EQ", oCompany) ];
			var oData =	this.getView().getModel("cData").getProperty("/disp");
		
			oModel.read("/FinDefaultSet",
			{
			 filters: bWhere,	
			 success: function(fData)
			 {
			 	

			 	 this.getView().getModel("cData").setProperty("/findefault", fData.results[0]);
			 	 //20210713 Add 
		    	if ( this._role === "FIN" &&  oData.status === "03" &&  oData.paymeths === "" )
				{
				var oFin =	this.getView().getModel("cData").getProperty("/findefault");
//				if (oFin !== undefined)
//				{
					oData.paymeths = oFin.paymethod;
					oData.dtaws ="03";
					oData.reco_acc = oFin.recoacc;
//				}
		 	 }
			 	 
			}.bind(this)
				
			});		
 //20210714 end		   
		    if( this._role === "FIN")
		    {
		    	oViewModel.setProperty("cView>/visible/bkfi",true);
		    }
		    else
		    {
		    	oViewModel.setProperty("cView>/visible/bkfi",false);
		    }
				    
			jQuery.each( oRule, function(a, b) 
			{
				switch(b)
				{
				case "E":
					editable = "/editable/" + a;
					oViewModel.setProperty(editable, true);
					break;
				case "H":
					visible = "/visible/" + a;
					oViewModel.setProperty(visible, false);
					break;
				case "D":
					editable = "/editable/" + a;
					oViewModel.setProperty(editable, false);				
					break;
				case "I":
					enable = "/enable/" + a;
					oViewModel.setProperty(enable, false);				
					break;
				case "A":
					enable = "/enable/" + a;
					oViewModel.setProperty(enable, true);
					
					visible = "/visible/" + a;
					oViewModel.setProperty(visible, true);
					
					break;
				}
	      
	    	}
	    );
	    
		
		var oData =	this.getView().getModel("cData").getProperty("/disp");
//20210623c Add			
		var oInfo = this.getView().getModel("cData").getProperty("/info");	
		var oDesc =	this.getView().getModel("cData").getProperty("/desc");
//20210623c Add
		
		
			
			if ( oData.status === "")
			{
				oData.status = this._status;
				if(this._status === "00" )
				{
					oData.submitted = "AA";
				}
			}
			
			if( oData.acc_group === "" )
			{
				oData.acc_group = 'Z001';
			}
			
			//>>>>20210609
			if(  this._scenario === "BY_FIN" )
			{
				oData.by_fin = true;
				oData.by_buyer = false;
				oData.by_nonpo = false;
				
			}
			else if(  this._scenario === "BY_BUYER" )
			{
				oData.by_fin = false;
				oData.by_buyer = true;
				oData.by_nonpo = false;
			}
			else if(  this._scenario === "BY_NONPO" )
			{
				oData.by_fin = false;
				oData.by_buyer = false;
				oData.by_nonpo = true;
				if( oData.buyer_name === "" )
				{
				 oData.buyer_name = this._user_id;
//0706 add				 
				 oData.company   = this._company;				 
//20210623c Add	
				oData.buyer_tel = oInfo.extens;
//20210709	Add	
				if (oData.company === undefined)
					{
					  oData.company   = oInfo.bukrs;
					}
				}
			}
			
			if(this._status === "00" && oData.buyer_name === "" )
			{
//20210623c Add				
				oData.buyer_name = this._user_id;
///0625				
			if (oInfo !== undefined)
			{
				oData.buyer_tel = oInfo.extens;
				oData.company = oInfo.bukrs;
				oDesc.company = oInfo.bukrs;
			}
			}
///0625				
			if (oInfo !== undefined)
			{
			if(this._status === "00" && oData.buyer_name === oInfo.buyer_name)
			{
				
				oDesc.buyer_name_desc = oInfo.ename;
				if (oData.company === oInfo.bukrs)
				{
//				oData.company = oInfo.bukrs;
//				oDesc.company = oInfo.bukrs;
				oDesc.company_desc = oInfo.company_desc;
				}
			}
//20210624c End	
			}
			//<<<<<20210609
			
			var i = 0;
			this._cpm = [];
			this._bkm = [];
			this._pym = [];

			for( i = 1; i <= oData.cpcnt; i++)
			{
			this._cpm.push("cp" + this.alphaIn(i) );
			}			
			
			for( i = 1; i <= oData.bkcnt; i++)
			{
			this._bkm.push("bk" + this.alphaIn(i) );
			}
		
			for( i = 1; i <= oData.pycnt; i++)
			{
			this._pym.push("py" + this.alphaIn(i) );
			}		
			
			this.getView().getModel("cData").setProperty("/disp", oData);
			//>>>20210618 add inut gray not editable/enable
    		this.setInputEnable();
    		//<<20210618
		},
//20210711 add
		lengthInUtf8Bytes:	function (str) {
		  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
		  var m = encodeURIComponent(str).match(/%[89ABab]/g);
		  return str.length + (m ? m.length : 0);
		},		
		
		setInputEnable:function()
    	{
    	   var binput = this.getView().getControlsByFieldGroupId("");

    	   for(var i = 0; i< binput.length ; i++)
    		{
    		 if( binput[i].getMetadata().getElementName()  === "sap.m.Input"  )
    		 {
//*20210711 Add
    		 	if( this.lengthInUtf8Bytes(binput[i].getValue() ) < 55 )
    		 	{
    			   binput[i].setEnabled( binput[i].getEditable() );
    		 	}
    		 	
//*    		   binput[i].setEnabled( binput[i].getEditable() );
    		 }
    		}
         },
		
		
		refreshBk:function()
		{
			for(  var i = 1; i <= 3; i++ )
			{
				
				var bkId = this.getView().byId("bk" + this.alphaIn(i)).getId();
				var bkShow = false;
				
				for( var j = 0; j < this._bkm.length; j++ ){
					if ( this._bkm[j] === "bk" + this.alphaIn(i) )
					{
						bkShow = true;	
						
					}
				}	
					
				if (bkShow) 
				{
					$("#" + bkId ).show();
				}
				else
				{ 	
					$("#" + bkId).hide(); 
					
				}					
			}						
		},
		
		refreshCp: function(){
			for( var i = 1; i <= 3; i++ )
			{
				
				var cpId = this.getView().byId("cp" + this.alphaIn(i)).getId();
				var cpShow = false;
				
				for( var j = 0; j < this._cpm.length; j++ )
				{
					if ( this._cpm[j] === "cp" + this.alphaIn(i) )
					{
						cpShow = true;	
						
					}
				}	
					
				if (cpShow) 
				{
					$("#" + cpId ).show();
				}
				else
				{ 	
					$("#" + cpId).hide(); 
				}					
			}
						
		},
		
		refreshPy: function() {
			
			for( var i = 1; i <= 3; i++ )
			{
				
				var pyId = this.getView().byId("py" + this.alphaIn(i)).getId();
				var pyShow = false;
				
				for( var j = 0; j < this._pym.length; j++ )
				{
					if ( this._pym[j] === "py" + this.alphaIn(i) )
					{
						pyShow = true;	}
					}	
					
				if (pyShow) 
				{
					$("#" + pyId ).show();
				}
				else{ 	
					$("#" + pyId).hide(); 
					
				}					
			}					
		},
		
		refreshGST: function()
		{
			var oViewModel = this.getView().getModel("cView");
			var oData =	this.getView().getModel("cData").getProperty("/disp");
			if ( oData.compland === "IN" && oData.country === "IN")
			{
			oViewModel.setProperty("/visible/gst", true);	
			}
			else
			{
			oViewModel.setProperty("/visible/gst", false);	
			}
		},	
			
		refreshDisplay: function() {
			
		
			var tbk = this.getView().byId("tbk").getId();
			var ttr = this.getView().byId("ttr").getId();
			var ktoks = this.getView().byId("acc_groups").getValue();
			var company = this.getView().byId("company").getValue();
			var bkm = this.getView().getControlsByFieldGroupId("bkm");
			var bkx = this.getView().getControlsByFieldGroupId("bkx");
			var checksel = this.getModel("cData").getProperty("/disp/bkcheck_pay");
			var bkmd ;
			var i;

			this.refreshCp();
			this.refreshPy();
			this.refreshGST();

			for(  i = 0; i < bkm.length; i++)
			{
				bkmd = bkm[i].getId();
				if (company === "MUS1")
				{
					$("#" + bkmd).css("display", "");	
				}
				else
				{
					$("#" + bkmd).css("display", "none");
				}
			}
		
			for( i = 0; i < bkx.length; i++)
			{
				bkmd = bkx[i].getId();
				if (company === "MUS1" && checksel )
				{
					$("#" + bkmd).css("display", "none");	
				}
				else
				{
				$("#" + bkmd).css("display", "");	
				}	
				
			}
			
			if( ! (company === "MUS1" && checksel ) )
			{
				this.refreshBk();
			}			

			if (ktoks === "Z001") 
			{
				
				$("#" + tbk).show();
				$("#" + ttr).show();

			} 
			else if (ktoks === "Z003") 
			{
				
				$("#" + tbk).show();
				$("#" + ttr).hide();
				
			}
			
			
			if (  this._scenario !== "BY_BUYER" )
			{
				$("#" + ttr).hide();
				
			}
			

			var upload = this.getView().byId("UploadSet");
			if ( upload.getUploadEnabled() === false)
			{
				for( i = 0; i < upload.getItems().length; i++ )
				{
					var uploaditemId = upload.getItems()[i].getId();
					$("#" + uploaditemId + "-editButton").hide();
					$("#" + uploaditemId + "-deleteButton").hide();
				}
			}

		},	
		
		initMessage:function(){
			
			
			if( this._role === "VENDOR" && this._checked !== true)
			{
				return;
			}
			
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageManager.removeAllMessages();
			this._oMessageManager.registerObject(this.getView(), true);
			this.getView().setModel(this._oMessageManager.getMessageModel(), "message");

			this.oMessageTemplate = new sap.m.MessagePopoverItem(
				{
				type: "{message>type}",
				title: "{message>title}",
				subtitle: "{message>subtitle}",
				description: "{message>description}"
			});

			this.oMessagePopover = new sap.m.MessagePopover(
				{

				itemSelect: function(oEvent) 
				{
					
					var oItem = oEvent.getParameter("item"),
						oBindingContext = oItem.getBindingContext("message");
					var oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
					var that = this;
					that._controlid = oData.controlIds;
					that._controltab = oData.controlTab;
					jQuery.sap.delayedCall(150, that, function() 
					{
					    this.getView().byId("idIconTabBarNoIcons").setSelectedKey(that._controltab);
						var cc = this.getView().byId(that._controlid);
						cc.focus();
						if (cc.getMetadata().getName() === "sap.m.Input")
						{
							cc.setValueState(sap.ui.core.ValueState.Error);	
						}
					
						this.refreshDisplay();
						//	cc.getDomRef().scrollIntoView();
					}.bind(this));

				}.bind(this),

				items: 
				{
					path: "message>/",
					template: this.oMessageTemplate
				}
			});
			this.byId("msgpopover").addDependent(this.oMessagePopover);			
		},
		
		onMsg:function(oEvent)
		{
			var oButton = oEvent.getSource();
			this.oMessagePopover.openBy(oButton);
		},
			
		readAttach:function(oModel, cWhere){
	 
			
			var andFilter = [];
			var orFilter = [];
				
			orFilter.push(new sap.ui.model.Filter("vendor_id", "EQ", this._vendorid));	
			andFilter.push(new sap.ui.model.Filter(orFilter, false));
			orFilter = [];
			orFilter.push(new sap.ui.model.Filter("upfactive", "EQ", "X"));	
			andFilter.push(new sap.ui.model.Filter(orFilter, false));
			
 
			
			oModel.read("/ZI_Vendor_attach", {
			 	filters: andFilter,		
				 success: function(oAttach) { 
				 
				 	var oItems = [];
				 	
				 	
				 	this.getView().byId("UploadSet").removeAllItems();
				 	this.getView().byId("UploadSet").removeAllIncompleteItems();
					//	UploadSet
				 	
				 	this.getModel("cAttach").setProperty("/items",oItems );
				 	
				 	for ( var i=0; i < oAttach.results.length; i++ )
				 	{
				 		
				 	var atts = [{
									"title": "Upload type",
									"text": oAttach.results[i].updtext,
									"active": true
								}, {
									"title": "Uploaded On",
									"text": oAttach.results[i].uptext.substr(0,4)+'/'+oAttach.results[i].uptext.substr(4,2)+'/'+ oAttach.results[i].uptext.substr(6,2) + ' ' +oAttach.results[i].uptext.substr(8,2) + ':' +oAttach.results[i].uptext.substr(10,2) + ':' + oAttach.results[i].uptext.substr(12,2),
									"active": true
								}, {
									"title": "File Size",
									"text": oAttach.results[i].fsize,
									"active": true
								},{
									"title": "Document Id",
									"text": oAttach.results[i].documentid,
									"active": true
									}
								];
									
				
				 		
				 	var cAttach = new	sap.m.upload.UploadSetItem( {
				 		"documentId": oAttach.results[i].documentid,
						"fileName": oAttach.results[i].filename,
						"mimeType": oAttach.results[i].mimetype,
						"thumbnailUrl": "",
						"size": oAttach.results[i].fsize,
						"url": oAttach.results[i].url,
						"uploadState": "Complete",
						"attributes": atts
						
        				} );
        				this.getView().byId("UploadSet").addItem(cAttach);
        		//	oItems.push(cAttach);
        		//	this.getModel("cAttach").setProperty("/items",oItems )	;
				 	}
				 	
				 }.bind(this)
				});	
				
			},	
			
		readWorkid:function(oModel)
		{
			
		 	oModel.read("/zsworkidSet", {
			 success: function(oData) { 
				if ( oData.results ) {
				 	this._workid = oData.results[0].Workid;
				}
					this.setDefaultData();
				//	this.getView().setBusy(false);
				
				setTimeout( function()
				{
				this.getView().setBusy(false);
				}.bind(this), 1500);
		
				
				
			 }.bind(this),
			 error: function(oEvent) {
				this.getView().setBusy(false);
			 }
			});		
			
			
		},	
		
		initVhVat:function()
		{
			
			var oModel = this.getOwnerComponent().getModel();
			
			oModel.read("/vhVat", 			{
		
			 success: function(aData) 
			 {
			 	this.getView().getModel("cData").setProperty("/vhVat", aData.results);
		
			 }.bind(this)
			}
			);
			
			
			
		},
		
		initJson:function()
		{
				
			this.getView().setModel(new JSONModel(
				{ 
					disp:{
						"vendor_code": "",
						"cpcnt":"01",
						"bkcnt":"01",
						"pycnt":"01",
						"country":"",
						"company":""
					} ,
					desc:{
						"company_desc":"",
						"acc_group_desc":""
					}
					,
//20210709 Add					
					info:{
						"bukrs":"",
						"buyer_name":"",
						"company_desc":"",
						"ename": "",
						"extens": ""
					,
					},					
					vhBkzlsch:[]
					
				}),"cData");
				
			this.getView().setModel(new JSONModel(
				{ "items":[]
				}), "cAttach");	
			this._cpm.push("cp01" );
			this._bkm.push("bk01" );
			this._pym.push("py01" );
			
			this.getView().setModel(new JSONModel({
    	
    			"editable":
    			{
    				"sys":false,
    				"sys1":false,
    				"bas":false,
    				"gst":false,
    				"tr":false,
    				"bk":false,
    				"bkfi":false,
    				"py":false,
    				"rm":false,
    				"attach":false
    			},
    			
    			"visible":
    			{
    				"bkfi":true,
    				"gst":false,
    				"writesap":true,
    				"cancel":true,
    				"chglog":true,
    				"applog":true,
    				"reemail":false,
    				"filetemp":false
    			},
    			
    			"enable":{
    				"sav":false,
    				"submit":false,
    				"writesap":false,
    				"cancel":false,
    				"clos":false,
    				"chglog":false,
    				"applog":false,
    				"reemail":false
    			}

			}), "cView");	
				
			},
			
			vhBukrs: function(oEvent) 
			{
				if (!this._vhBukrsDialog) 
				{
					this._vhBukrsDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhBukrs", this);
					this.getView().addDependent(this._vhBukrsDialog);
				}
				
				var noFilter = []; 
				this._vhBukrsDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
//20210624c add				
// 				
// 				if(this._scenario === "BY_BUYER"){
// //					var oCompany = this.getView().getModel("cData").getProperty("/disp/company");
// 					var andFilter = [];
// 					var orFilter = [];
// 					orFilter.push(new sap.ui.model.Filter("id", "EQ", "MTKW" ));
// 					andFilter.push(new sap.ui.model.Filter(orFilter, false));
// 					orFilter = [];
// 
// 					var oBinding = this._vhBukrsDialog.getBinding("items");
// 					oBinding.filter(new sap.ui.model.Filter(andFilter, true));					
// 				}	
//20210624c end				
				this._vhBukrsDialog.open();
				this._vhID = oEvent.getSource().getId();
			},
			
			
			vhCpfunc: function(oEvent) 
			{
				if (!this._vhCpfuncDialog) 
				{
					this._vhCpfuncDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhCpfunc", this);
					this.getView().addDependent(this._vhCpfuncDialog);
				}
				var noFilter = []; 
				this._vhCpfuncDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));				
				this._vhCpfuncDialog.open();
				this._vhID = oEvent.getSource().getId();
			},
			
			vhAccgrp: function(oEvent) 
			{
				if (!this._vhAccgrpDialog) 
				{
					this._vhAccgrpDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhAccgrp", this);
					this.getView().addDependent(this._vhAccgrpDialog);
				}
				var noFilter = []; 
				this._vhAccgrpDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));					
				
				// Srart 2021/06/11
				if(this._scenario === "BY_BUYER"){
					
					var andFilter = [];
					var orFilter = [];
					orFilter.push(new sap.ui.model.Filter("id", "EQ", "Z001" ));
					andFilter.push(new sap.ui.model.Filter(orFilter, false));
					orFilter = [];

					var oBinding = this._vhAccgrpDialog.getBinding("items");
					oBinding.filter(new sap.ui.model.Filter(andFilter, true));					
				}				
				// Ended 2021/06/11				
			
				
				this._vhAccgrpDialog.open();
				
				
			   var shId = this._vhAccgrpDialog._searchField.getId();
				$("#"+shId).hide();
				
				this._vhID = oEvent.getSource().getId();
			},			
			
			vhTitle: function(oEvent) 
			{
		
				if (!this._vhTitleDialog) 
				{
					this._vhTitleDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhTitle", this);
					this.getView().addDependent(this._vhTitleDialog);
				}
				
				var noFilter = []; 
				this._vhTitleDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));					
				
				var andFilter = [];
				var orFilter = [];
				
				if(	oEvent.getSource().getId().search("cp") >= 0  )
				{
					orFilter.push(new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.NE , "0003" ));
					andFilter.push(new sap.ui.model.Filter(orFilter, false));
					orFilter = [];
				}
			
				
				var oBinding = this._vhTitleDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));				
				
				this._vhTitleDialog.open();
				this._vhID = oEvent.getSource().getId();
				
				 var shId = this._vhTitleDialog._searchField.getId();
				$("#"+shId).hide();
				
			},	
			
			vhLand1: function(oEvent) 
			{
				if (!this._vhLand1Dialog) 
				{
					this._vhLand1Dialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhLand1", this);
					this.getView().addDependent(this._vhLand1Dialog);
				}
				
				var noFilter = []; 
				this._vhLand1Dialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
				
				this._vhLand1Dialog.open();
				this._vhID = oEvent.getSource().getId();
			},	
			
			vhVat: function(oEvent) 
			{
			
				var vatData = this.getView().getModel("cData").getProperty("/vhVat");
				var oland1 = this.getView().getModel("cData").getProperty("/disp/country");
				var oFind = [];
				for( var i = 0; i < vatData.length; i++)
				{
					if ( vatData[i].land1 === oland1 )
					{
						oFind.push(vatData[i].land1);
						break;
					}
				}
			
				if( oFind.length <= 0 )
				{
					
//20210611					var oname1 = this.getView().byId("name1").getValue();
//20210611					this.getView().byId("vat_code").setDescription("MEDIATEK DEFINE");
//20210611					this.getView().byId("vat_code").setValue(oname1.toString().substr("0",15));
					this.getView().byId("vat_code").setDescription("");
					this.getView().byId("vat_code").setValue("MEDIATEK DEFINE");
					this.getView().byId("vat_desc").setText("");
					
					return;
					
				}
				
				
				if (!this._vhVatDialog) 
				{
					this._vhVatDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhVat", this);
					this.getView().addDependent(this._vhVatDialog);
				}
				
				
				var andFilter = [];
				var orFilter = [];
				
				this._vhVatDialog.getBinding("items").filter(new sap.ui.model.Filter(andFilter, true));
				
				var oCountry = this.getView().getModel("cData").getProperty("/disp/country");
//20210615 add				
				var oTitle = this.getView().getModel("cData").getProperty("/disp/title");
//20210615 end								
				
				orFilter.push(new sap.ui.model.Filter("land1", 'EQ', oCountry ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
//20210615 add	
				if(oCountry === "TW"  && (oTitle === "0001" || oTitle === "0002") )
				{
				  orFilter.push(new sap.ui.model.Filter("seqno","EQ","2"));
				  andFilter.push(new sap.ui.model.Filter(orFilter, false));
				  orFilter = [];
				}
				else if(oCountry === "TW")
				{
				  orFilter.push(new sap.ui.model.Filter("seqno","EQ","1"));
				  andFilter.push(new sap.ui.model.Filter(orFilter, false));
				  orFilter = [];	
				}
//20210615 end				
				
				var oBinding = this._vhVatDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));			
				
				this._vhVatDialog.open();
				this._vhID = oEvent.getSource().getId();
 				var shId = this._vhVatDialog._searchField.getId();
 				$("#"+shId).hide();

				
				
			},				
			
			vhBkwaers: function(oEvent) 
			{
				
				if (!this._vhBkwaersDialog) 
				{
					this._vhBkwaersDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhBkwaers", this);
					this.getView().addDependent(this._vhBkwaersDialog);
				}
				
				var andFilter = [];
				var orFilter = [];
				var oCompany = this.getView().getModel("cData").getProperty("/disp/company");
				orFilter.push(new sap.ui.model.Filter("zbukr", "EQ", oCompany ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				var oBinding = this._vhBkwaersDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));			
				
				this._vhBkwaersDialog.open();
				this._vhID = oEvent.getSource().getId();
				
				
				var shId = this._vhBkwaersDialog._searchField.getId();
 				$("#"+shId).hide();				
			},	
			
			
			vhZterm: function(oEvent) 
			{
				if (!this._vhZtermDialog) 
				{
					this._vhZtermDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhZterm", this);
					this.getView().addDependent(this._vhZtermDialog);
				}
				
				var noFilter = []; 
				this._vhZtermDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
							
				this._vhZtermDialog.open();
				this._vhID = oEvent.getSource().getId();
			},
			
			vhVndtyp: function(oEvent) 
			{
				if (!this._vhVndtypDialog) 
				{
					this._vhVndtypDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhVndtyp", this);
					this.getView().addDependent(this._vhVndtypDialog);
				}

				var noFilter = []; 
				this._vhVndtypDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
					
				this._vhVndtypDialog.open();
				this._vhID = oEvent.getSource().getId();
			},	
			
			vhTrwaers: function(oEvent) 
			{
				if (!this._vhTrwaersDialog) 
				{
					this._vhTrwaersDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhTrwaers", this);
					this.getView().addDependent(this._vhTrwaersDialog);
				}
				
				var noFilter = []; 
				this._vhTrwaersDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
					
				this._vhTrwaersDialog.open();
				this._vhID = oEvent.getSource().getId();
			},	

			vhTrsterm: function(oEvent) 
			{
				if (!this._vhTrstermDialog) 
				{
					this._vhTrstermDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhTrsterm", this);
					this.getView().addDependent(this._vhTrstermDialog);
				}
				
				var noFilter = []; 
				this._vhTrstermDialog.getBinding("items").filter(new sap.ui.model.Filter(noFilter, true));
				
				this._vhTrstermDialog.open();
				this._vhID = oEvent.getSource().getId();
			},	
			
			
			vhBkfee: function(oEvent) 
			{
				if (!this._vhBkfeeDialog) 
				{
					this._vhBkfeeDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhBkfee", this);
					this.getView().addDependent(this._vhBkfeeDialog);
				}
				
				var andFilter = [];
				var orFilter = [];
				var oCountry = this.getView().getModel("cData").getProperty("/disp/country");
				orFilter.push(new sap.ui.model.Filter("banks", "EQ", oCountry ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				var oBinding = this._vhBkfeeDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));	
				
				this._vhBkfeeDialog.open();
				this._vhID = oEvent.getSource().getId();
				
				
				var shId = this._vhBkfeeDialog._searchField.getId();
				$("#"+shId).hide();
				
			},	
			

			vhUptyp: function(oEvent) 
			{
				
				if (!this._vhUptypDialog) 
				{
					this._vhUptypDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhUptyp", this);
					this.getView().addDependent(this._vhUptypDialog);
				}
				
				// var andFilter = [];
				// var orFilter = [];
				// var oCompany = this.getView().getModel("cData").getProperty("/disp/company");
				// orFilter.push(new sap.ui.model.Filter("bukrs", "EQ", oCompany ));
				// andFilter.push(new sap.ui.model.Filter(orFilter, false));
				// orFilter = [];
				// var oBinding = this._vhUptypDialog.getBinding("items");
				// oBinding.filter(new sap.ui.model.Filter(andFilter, true));
				
				// Begin 2021/06/11 add
				var andFilter = [];
				var orFilter = [];
				var oCompany = this.getView().getModel("cData").getProperty("/disp/company");
				var oCompland = this.getView().getModel("cData").getProperty("/disp/compland");
				var oTitle = this.getView().getModel("cData").getProperty("/disp/title");
				var oCountry = this.getView().getModel("cData").getProperty("/disp/country");
				
				var oCountryType = "A"; 	//all
				var oVendorType = "A";		//all
				
				if( oCountry === oCompland){
					oCountryType = "D";		//Domestic
				}
				else { //if (oCountry !== "TW" && oCountry !== "")
					oCountryType = "F"; 	//Foreign
				}
				
			
				if(oTitle === "0003"){
					oVendorType = "C";		//Company
				}
				else if(oTitle !== "0003" && oTitle !== ""){
					oVendorType = "I";		//Individual
				}
				orFilter.push(new sap.ui.model.Filter("bukrs", "EQ", oCompany ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];

				
			
								
				orFilter.push(new sap.ui.model.Filter("countrytype", "EQ", oCountryType ));
				orFilter.push(new sap.ui.model.Filter("countrytype", "EQ","A" ));
				
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];		

				orFilter.push(new sap.ui.model.Filter("vendtype", "EQ", oVendorType ));
				orFilter.push(new sap.ui.model.Filter("vendtype", "EQ", "A" ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				
				
				var oBinding = this._vhUptypDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));				
				// Ended 2021/06/11 add
				
				this._vhUptypDialog.open();
				this._vhID = oEvent.getSource().getId();

				var shId = this._vhUptypDialog._searchField.getId();
				$("#"+shId).hide();
			},					

			
			vhBkrecon: function(oEvent) 
			{
				if (!this._vhBkreconDialog) 
				{
					this._vhBkreconDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhBkrecon", this);
					this.getView().addDependent(this._vhBkreconDialog);
				}
				
				var andFilter = [];
				var orFilter = [];
				var oCompany = this.getView().getModel("cData").getProperty("/disp/company");
				orFilter.push(new sap.ui.model.Filter("bukrs", "EQ", oCompany ));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				var oBinding = this._vhBkreconDialog.getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));	
				
				this._vhBkreconDialog.open();
				this._vhID = oEvent.getSource().getId();
				
				var shId = this._vhBkreconDialog._searchField.getId();
				$("#"+shId).hide();
												
			},					

			
			vhBkzlschClose: function(oEvent) 
			{

				var aData = [];
					aData = this.getView().getModel("cData").getProperty("/vhBkzlsch");
				var tt = "";
				for( var i = 0; i < aData.length; i++)
				{
					if( aData[i].selected === true )
					{
						tt = tt + aData[i].id;
					}
				}
		
				var input = this.getView().byId("paymeths");
						input.setValue(tt);	
					
			},			
			
	
		
			vhBkzlsch: function(oEvent) 
			{
			
			
			var cBukrs = this.getModel("cData").getProperty("/disp/company");
			var oModel = this.getView().getModel();
			var cWhere = [ new Filter("bukrs", "EQ", cBukrs) ];	
			
			oModel.read("/vhBkzlsch", 
			{
			 filters: cWhere,	
			 success: function(aData) 
			 {
				var zVal = this.getView().byId("paymeths").getValue();
				var tVal = [];
				var i = 0;
				for ( i = 0; i < zVal.length; i++ ) 
				{
				  if ( zVal[i] !== "" ) 
				  {
				  	tVal.push(zVal[i]);
				  } 
				}
				 
				for(  i = 0; i < aData.results.length; i++ )
				{
					if ( tVal.indexOf( aData.results[i].id ) >= 0 )
					{
							aData.results[i].selected = true;
					}
				
				}
				 
			 	this.getView().getModel("cData").setProperty("/vhBkzlsch", aData.results);
			 
			 
			 
				if (!this._vhBkzlschDialog) 
				{
					this._vhBkzlschDialog = sap.ui.xmlfragment("MTK.ZUMPUP0001.fragment.vhBkzlsch", this);
					
					this.getView().addDependent(this._vhBkzlschDialog);
				}
				

				this._vhBkzlschDialog.open();
			 
			 }.bind(this)
			}
			);

		},
			
			vhSearch: function(oEvent) 
			{

				var sValue = oEvent.getParameter("value");
				var andFilter = [];
				var orFilter = [];
				orFilter.push(new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, sValue));
				orFilter.push(new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sValue));
				andFilter.push(new sap.ui.model.Filter(orFilter, false));
				orFilter = [];
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter(andFilter, true));
			},

			vhClose: function(oEvent) 
			{
					
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					var cc = aContexts.map(function(oContext) 
					{
						return oContext.getObject();
					});
					var input = this.byId(this._vhID);
					
					if ( this._vhID ===  "__component0---worklist--company" )
					{
						var compland = this.byId("__component0---worklist--compland");
						compland.setValue(cc[0].compland);
					}
						
					if ( this._vhID ===  "__component0---worklist--vat_code"  )
					{
					//20210617
            		//<description> (e.g.:  <format>)						
						this.getView().byId("vat_desc").setText(cc[0].text + "(e.g.:" +cc[0].id + ")"  );
						cc[0].id = input.getValue();						
						cc[0].text = "";
					}
					
					if ( this._vhID ===  "__component0---worklist--uptyp"  )
					{
						this.getView().byId("uptyp_desc").setText(cc[0].text);
						cc[0].text = "";
						
						if( cc[0].tmp === 'X' )
						{
							this.getView().getModel("cView").setProperty("/visible/filetemp", true);
							this.getView().getModel("cView").setProperty("/filetemp", cc[0]);
						}
						else
						{
							this.getView().getModel("cView").setProperty("/visible/filetemp", false);
							this.getView().getModel("cView").setProperty("/filetemp", cc[0]);
						}
					}
					
					input.setValue(cc[0].id);
					input.setDescription(cc[0].text);
					input.setValueState(sap.ui.core.ValueState.None);
					this.refreshDisplay();
				}
			},
			
			onDownloadFiletemp:function(oEvent){
				
				var cc = this.getView().getModel("cView").getProperty("/filetemp");
				
				var sPre = "/sap/opu/odata/SAP/ZVENDOR_SRV/FileSet(",
				sCom = "'",
				sVal = ")/$value",
				sDocID = "tmp" + "@" + cc.bukrs + "@"+ cc.id,
				sUrl="";
				
				sUrl = sPre + sCom + sDocID + sCom + sVal;
			
				var w = window.open(sUrl, '_blank');
				if (w == null) 
				{
					sap.m.MessageToast.show(this.i18n("File_Error"));
				}			
			
			},
		
			onCheckCk: function(oEvent){
			if ( oEvent.getSource().getSelected() )
			{
				oEvent.getSource().setText("Yes");
				
				$("#__component0---worklist--bk01").hide();
				$("#__component0---worklist--bk02").hide();
				$("#__component0---worklist--bk03").hide();
				$("#__component0---worklist--bkbut").hide();
				
			}
			else 
			{
				oEvent.getSource().setText("No");
				$("#__component0---worklist--bk01").show();
				$("#__component0---worklist--bk02").show();
				$("#__component0---worklist--bk03").show();	
				$("#__component0---worklist--bkbut").show();
				this.refreshDisplay();
			}
			
		
		},
		
			onCk: function(oEvent){
			if ( oEvent.getSource().getSelected() )
			{
				oEvent.getSource().setText("Yes");
			}
			else
			{
				oEvent.getSource().setText("No");
			}
			
		
		},
		
		onCkother_incoterms: function(oEvent)
		{

			if ( oEvent.getSource().getSelected() )
			{
				$("#__component0---worklist--incoterms").hide();
				$("#__component0---worklist--incotermst").hide();
				this.incoterms_show = false;
			}
			else 
			{
				$("#__component0---worklist--incoterms").show();
				$("#__component0---worklist--incotermst").show();
				this.incoterms_show = true;
			}
			
		
		},
			
			onCpadd: function(oEvent) 
		{
	
			if ( this._cpm.length === 3 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.cpcnt ++;
			this._cpm.push("cp" + this.alphaIn(aData.cpcnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);
			this.refreshDisplay();
		},

			onCpless: function(oEvent) 
		{
	
			if ( this._cpm.length === 1 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.cpcnt --;
			this._cpm.pop("cp" + this.alphaIn(aData.cpcnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);	
			this.refreshDisplay();
		},

			onBkadd: function(oEvent) 
			{
	
			if ( this._bkm.length === 3 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.bkcnt ++;
			this._bkm.push("bk" + this.alphaIn(aData.bkcnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);
			this.refreshDisplay();
		},

			onBkless: function(oEvent) 
			{
	
			if ( this._bkm.length === 1 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.bkcnt --;
			this._bkm.pop("bk" + this.alphaIn(aData.bkcnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);	
			this.refreshDisplay();
		},
			


			onPyadd: function(oEvent) 
			{
	
			if ( this._pym.length === 3 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.pycnt ++;
			this._pym.push("py" + this.alphaIn(aData.pycnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);
			this.refreshDisplay();
		},

			onPyless: function(oEvent) 
			{
	
			if ( this._pym.length === 1 )
			{
				return;
			}
			var aData = oEvent.getSource().getModel("cData").getProperty("/disp");
			aData.pycnt --;
			this._pym.pop("py" + this.alphaIn(aData.pycnt) );
			oEvent.getSource().getModel("cData").setProperty("/disp", aData);	
			this.refreshDisplay();
		},			
			
			onTab: function(oEvent) 
			{


		//	this.getView().setBusy(true);	
		//	var oModel = this.getOwnerComponent().getModel();
		//	var cWhere = [ new Filter("vendor_id", "EQ", this._vendorid) ];	
		
		
		//	this.readAttach(oModel, cWhere);

			var iKey = oEvent.getParameters("selectedKey").key;
			if ( iKey === "tr" ||  iKey === "bk" || iKey === "py" || iKey === "att" ) {
					this.refreshDisplay();
			}
		}	,
		
		onItemRemoved:function(oEvent)
		{
			
			this.getView().getModel("cAttach").refresh();
		},
		
		onUploadItemAdd:function(oEvent)
		{
			
			oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().setBusy(true);
			this.getView().getModel("cAttach").refresh();
		},
		
		onUploadComplete: function(oEvent) 
		{
			
			
	//	var oData = oEvent.getParameter("item").getModel("cAttach").getData();
			
			var upTyp = this.getView().byId("uptyp");

			var sDocID = this.getView().getModel("cAttach").getProperty("/sDocID");
			
			var sUrl  = this.getView().getModel("cAttach").getProperty("/sSUrl");
			
			var st = "Success";
			
			var sttxt = "Success";
			
			var uploadState = "";
			
			if( upTyp.getValue() === "")
			{
				st = "Error";
				sttxt = this.i18n("Upload_file_type_error");
				uploadState = "Complete";
			}
			else if ( oEvent.getSource().getItems().length >= 9 )
			{
				st = "Error";
				sttxt = this.i18n("Upload_file_number_more_than_9_files");
				uploadState = "Complete";
			}
			else
			{
				 uploadState = 	 oEvent.getParameter("item").getUploadState();
			}
			

		var		sSize = this.getView().getModel("cAttach").getProperty("/sSize");
		
			oEvent.getSource().removeAllHeaderFields();
			oEvent.getSource().removeAllIncompleteItems();
			
		
		
		 var zNew = new	sap.m.upload.UploadSetItem({

		//	oData.items.unshift({
				"documentId": sDocID,
				"fileName": oEvent.getParameter("item").getFileName(),
				"mimeType": "",
				"thumbnailUrl": "",
				"uploadState":  uploadState, 
			//	"visibleEdit" : "false",
				"url": sUrl,

				"attributes": [{
					"title": "Upload type",
					"text": upTyp.getValue(),
					"active": true
				}, {
					"title": "Uploaded On",
					"text": new Date().toLocaleDateString('zh-Hans-CN') + " " + new Date().toLocaleTimeString('it-IT'),
					"active": true
				}, {
					"title": "File Size",
					"text": sSize,
					"active": true
				},{
					"title": "Document Id",
					"text": sDocID,
					"active": true
				}
				
				],
				"statuses": [{
					"title": "Status",
					"text": sttxt, 
					"state": st
				}],
				"markers": [{}],
				"selected": false
			});
			
			oEvent.getSource().addItem(zNew);

			setTimeout(function() {

				this.getView().setBusy(false);
				if(st === "Error" )
				{
				sap.m.MessageToast.show(this.i18n("Upload_Error."));
				}
				else
				{
				sap.m.MessageToast.show(this.i18n("Upload_Finish."));
				}
			//
			}.bind(this), 100);
		},
		
		onBeforeUploadStarts: function(oEvent) 
		{

			
			this.getView().setBusy(true);
			var upTyp = this.getView().byId("uptyp");
			
			//if( upTyp.getValue() === "")
			//{
			//	return;
			//}
			//if ( oEvent.getSource().getItems().length >= 9 )
			//{
			//	return;
			//}

			var sDocID = Date.now().toString(); 

			this.getView().getModel("cAttach").setProperty("/sDocID", sDocID);
			
			var	sSize = oEvent.getParameter("item").getFileObject().size;
			this.getView().getModel("cAttach").setProperty("/sSize", sSize);
			
			var fileName = oEvent.getParameter("item").getFileName();
			
			
			var sPre = "/sap/opu/odata/SAP/ZVENDOR_SRV/FileSet(",
				sCom = "'",
				sVal = ")/$value",
				sUrl = sPre + sCom + sDocID + sCom + sVal;
			this.getView().getModel("cAttach").setProperty("/sSUrl", sUrl);
		
			
			var Slug = sDocID + "@" + this._workid + '@' + this._vendorid + '@' + 	encodeURIComponent(fileName) + '@' + sSize + '@' + upTyp.getValue() + '@' + sUrl;


			var oCustomerHeaderSlug = new sap.ui.core.Item({
				key: "Slug",
				text: Slug 
			});

			var oModel = this.getView().getModel();

			oModel.refreshSecurityToken();

			var cc = oModel.getSecurityToken();

			var oCustomerHeaderToken = new sap.ui.core.Item({
				key: "X-CSRF-Token",
				text: cc
			});
//20210622 Add			
			 var oCx = new sap.ui.core.Item({
			 key: "X-Requested-With",
		     text: "X"
			});
//20210622 Add	End			
			
			oEvent.getSource().addHeaderField(oCustomerHeaderToken);
			oEvent.getSource().addHeaderField(oCustomerHeaderSlug);
//20210622 Add				
			oEvent.getSource().addHeaderField(oCx);
//20210622 Add	End				
	 //   var aIncompleteItems =	oEvent.getSource().getIncompleteItems();	
	 //   for(var i=0; i<aIncompleteItems.length; i++){
	 //	oEvent.getSource().addHeaderField(oCustomerHeaderToken).addHeaderField(oCustomerHeaderSlug).uploadItem(aIncompleteItems[0]);
	 //	oEvent.getSource().removeAllHeaderFields();
	 // }	
	 //	oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
	 //	oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);

		},

		onUploadTerminated: function() 
		{
			
			sap.m.MessageToast.show(this.i18n("Upload_Terminated"));
		},
		
		setFilename: function(oDataData)
		{
			
			var cAttachItems = this.getView().byId("UploadSet").getItems();
		//		oDataData.getData().disp.fcnt = this.alphaIn(cAttachItems.length);
				
			oDataData.getData().disp.f1documentid ="";
			oDataData.getData().disp.f1filename="";
			oDataData.getData().disp.f2documentid ="";
			oDataData.getData().disp.f2filename="";
			oDataData.getData().disp.f3documentid ="";
			oDataData.getData().disp.f3filename="";
			oDataData.getData().disp.f4documentid ="";
			oDataData.getData().disp.f4filename="";
			oDataData.getData().disp.f5documentid ="";
			oDataData.getData().disp.f5filename="";
			
			
			oDataData.getData().disp.f6documentid ="";
			oDataData.getData().disp.f6filename="";
			oDataData.getData().disp.f7documentid ="";
			oDataData.getData().disp.f7filename="";
			oDataData.getData().disp.f8documentid ="";
			oDataData.getData().disp.f8filename="";
			oDataData.getData().disp.f9documentid ="";
			oDataData.getData().disp.f9filename="";			
			var j = 0;
			for( var i=0; i<cAttachItems.length; i++)
			{
				if (cAttachItems[i].getAttributes().length < 2 )
				{
					continue;
				}
				else
				{
					j++;
				}
				switch(j)
				{
				case 1:
				
					oDataData.getData().disp.f1documentid =	cAttachItems[i].getAttributes()[3].getText();
				    oDataData.getData().disp.f1filename   =	cAttachItems[i].getFileName();
				
					break;
				case 2:
					oDataData.getData().disp.f2documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f2filename   =	cAttachItems[i].getFileName();
					break;
				case 3:
					oDataData.getData().disp.f3documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f3filename   =	cAttachItems[i].getFileName();
					break;
				case 4:
					oDataData.getData().disp.f4documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f4filename   =	cAttachItems[i].getFileName();
					break;
				case 5:
					oDataData.getData().disp.f5documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f5filename   =	cAttachItems[i].getFileName();
					break;
				case 6:
					oDataData.getData().disp.f6documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f6filename   =	cAttachItems[i].getFileName();
					break;
				case 7:
					oDataData.getData().disp.f7documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f7filename   =	cAttachItems[i].getFileName();
					break;
				case 8:
					oDataData.getData().disp.f8documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f8filename   =	cAttachItems[i].getFileName();
					break;
				case 9:
					oDataData.getData().disp.f9documentid =	cAttachItems[i].getAttributes()[3].getText();
					oDataData.getData().disp.f9filename   =	cAttachItems[i].getFileName();
					break;
				}
			} 
			
			oDataData.getData().disp.fcnt = this.alphaIn(j);
				
			return oDataData;			
		},
		
		beforeSend:function(oDataData, behavior)
		{
			this.getView().setBusy(true);
			oDataData.getData().disp.workid = this._workid;
			oDataData.getData().disp.role = this._role;
			oDataData.getData().disp.action = behavior;
			oDataData.getData().disp.cpcnt = this.alphaIn(oDataData.getData().disp.cpcnt);
			oDataData.getData().disp.bkcnt = this.alphaIn(oDataData.getData().disp.bkcnt);
			oDataData.getData().disp.pycnt = this.alphaIn(oDataData.getData().disp.pycnt);	
			return oDataData;
		},
		rebuildMsg:function(aMsg)
		{
		
		
		var aMockMessages = [];
	
		
		
		for( var i = 0; i < aMsg.length; i++)
		{

		if( aMsg[i].vendor_id !== "" )
		{
			this._vendorid = aMsg[i].vendor_id;
		}
		
		var xMsg =
					{
						type:  aMsg[i].type,
						title: aMsg[i].title,
						description: aMsg[i].description,
						subtitle: aMsg[i].subtitle,
						controlTab: aMsg[i].controltab,
						controlIds: aMsg[i].controlid
					};


			aMockMessages.push(xMsg);	
		}	
		
		var oModel = new JSONModel();
			this.getView().setModel(oModel, "message");
			oModel.setData(aMockMessages);
			
			var oButton = this.getView().byId("msgpopover");
			setTimeout( function()
			{
				this.getView().setBusy(false);
				this.oMessagePopover.openBy(oButton);
			}.bind(this), 1500);
		
		
						
		},
		
		readSendresult:function()
		{
			
			
			var oModel = this.getOwnerComponent().getModel();
			var cWhere = [ new Filter("workid", "EQ", this._workid) ];	
		
			oModel.read("/ZI_Vendor_msg", 
			{
			 filters: cWhere,	
			 success: function(aMsg) 
			 {
		
				if( aMsg.results.length > 0)
				{
					this.rebuildMsg(aMsg.results);
				    this.readData();
				}
				else
				{
					this.readData();
					
				}
			 	
			 }.bind(this)
			}
			);
			
		},
		sendData:function(oDataObject,oDataData)
		{
			
			var dispData = oDataData.getData().disp;
//20210622 Add
			oDataObject.setHeaders({"X-Requested-With" : "X"});
//20210622 Add end

		
			oDataObject.create("/ZI_Vendor_data",	dispData, {
				success: function() {
					sap.m.MessageToast.show(this.i18n("Save_Successfully"));
					this.readSendresult();
				oDataObject.read("/zsworkidSet", {
				 success: function(oData2) { 
					if ( oData2.results ) {
				 		this._workid = oData2.results[0].Workid;
					}
					else
					{
						//add 20210629 for workid not get
					sap.m.MessageBox.error("Some error for workid");
					this.getView().setBusy(true);
					}
					//	this.getView().setBusy(false);
				//>>>20210615	
				this.getView().byId("idIconTabBarNoIcons").setSelectedKey("bas");	
						
					 }.bind(this),
				 error: function(oEvent) {
				 	//add 20210629 for workid not get
				 	sap.m.MessageBox.error("Some error for workid");
				 		this.getView().setBusy(true);
			 }});
					
				}.bind(this),
				error: function() {
					sap.m.MessageBox.error("Some error");
					this.getView().setBusy(false);
				}.bind(this)
			});
		},
		
		_validateInput:function(oEvent){
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			
			
		},
		
		createObjectMarker: function(sId, oContext) {
			var mSettings = null;

			if (oContext.getProperty("type")) {
				mSettings = {
					type: "{type}",
					press: this.onMarkerPress
				};
			}
			return new sap.m.ObjectMarker(sId, mSettings);
		},

		formatAttribute: function(sValue) {
			if (jQuery.isNumeric(sValue)) {
				return sap.ui.core.format.FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},
		
		i18n:function(txt)
		{
			return this.getView().getModel("i18n").getResourceBundle().getText(txt);
		},	
	
		getParameterByName: function(name) 
		{
			var url = window.location.href;
//20210714
			var portal = "DynamicParameter=param%3D";
			url.replace(portal, "param=");
			
			var xurl = url;
			var xparam = "";
			if( xurl.search("param=") >= 0)
			{
				xparam = this.getParameterByParam("param");
				var decoded = atob(xparam);
				url = url + "&" + decoded;
			}
			
			name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
			var results = regex.exec(url);
			if (!results) return '';
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		},		
		
		getParameterByParam: function(name)
		{
			var url = window.location.href;
//20210714
			var portal = "DynamicParameter=param%3D";
			url.replace(portal, "param=");
			
				name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
			var results = regex.exec(url);
			if (!results) return '';
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		},
			
		alphaIn: function(num)
		{
			if ( num === '0' || num === 0  || num === -1)
			{
			return '0';
			}
			else if ( num.toString().length === 1 )
			{
			return '0'+num;	
			}
			else if ( num.toString().length >=2 )
			{
			return num;	
			}
		}			

		});
	}
);