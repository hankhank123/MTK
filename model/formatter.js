sap.ui.define([
	] , function () {
		"use strict";
	
		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			 action: function(v)
			 {
			 		if (!v) {
					return "";
				}
				
				switch(v)
				{
					case "SA":
						return 'SAVE';
						
					case "SM":
							return 'SUBMIT';
					
					case "SP":
						return 'WRITE TO SAP';
				
					case "CL":
							return 'CANCEL';
					
				}
			 },
			 time: function(v)
			 {
			 	if (!v) {
					return "";
				}
			
			 	return v.substr(0,2) + ":" + v.substr(2,2) + ":" + v.substr(4,2);;
			 },
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			
			status: function(v)
			{
			 		if (!v) {
					return "";
				}
				
				switch(v)
				{
					case "00":
						return 'Created';
						
					case "01":
							return 'Process';
					
					case "02":
						return 'BUYER Verified';
				
					case "03":
							return 'FIN Verified';

					case "04":
							return 'Completed';
							
					case "05":
							return 'Canceled';
					
				}				
			},
			
			submitted: function(v)
			{
			 		if (!v) {
					return "";
				}
				
				switch(v)
				{
					case "00":
						return 'Creation submitted';
						
					case "01":
							return 'Vendor submited';
					
					case "02":
						return 'Buyer submitted';
				
					case "03":
							return 'FIN submitted';

					case "XX":
							return 'Canceled';
							
					case "AA":
							return 'Created';
					
				}				
		},
//20210623 add
 		 	field: function(v)
 			
			 {
			 	if(!v) {
			 		return "";
			 	}
			 	else
			 	{
//			 		var desc =this.getView().getModel("i18n").getResourceBundle().getText(v);
			 		return	(this.i18n(v));
			 	}
			 	
			 }
//20210623 add end

		};

	}
);