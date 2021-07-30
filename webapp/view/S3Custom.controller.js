sap.ui.controller("cross.fnd.fiori.inbox.CA_FIORI_INBOXExtension.view.S3Custom", {

	extHookChangeFooterButtons: function(B) {
		// Place your hook implementation code here 
		
	//	var l_len = B.aButtonList.length;
	//B.aButtonList[5].sI18nBtnTxt
	//"XBUT_SHOWLOG" "XBUT_RELEASE" "XBUT_FORWARD" "XBUT_RESUBMIT"
		var lt_but = [];
		for (var i = 0; i <  B.aButtonList.length; i++) {
			if( 
			//	B.aButtonList[i].sI18nBtnTxt === "XBUT_RELEASE" ||
			//  B.aButtonList[i].sI18nBtnTxt ===  "XBUT_FORWARD" ||
			    B.aButtonList[i].sI18nBtnTxt ===  "XBUT_RESUBMIT" )
			{
				continue;
			}
			else
			{
			lt_but.push(B.aButtonList[i]);
			}
		}
		
			B.aButtonList = lt_but;
			return B;

	}

});