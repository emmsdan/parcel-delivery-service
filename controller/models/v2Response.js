import validator from 'validator';

/**
 * v2Response.js:
 * Handles simple response.
 * can set response status, response message (string or array)
 * make ref to: #162088549 on PT.
 */
const response = Symbol('response');
const statusCode = Symbol('statusCode');
class v2Response {
  /**
   *  no value is to be pasted to constructor,
   * since the class is to be inherited
   */
   constructor() {
		if (new.target === v2Response){
			throw new Error (`Class Can't can be Instantiated`);
		}
     this[response] = [];
     this[statusCode] = 200;
   }
   setStatus (code) {
     if(this.validator.isNumeric(code)){
      this[statusCode] = code;
     }
     return;
   }
   setResponse (resp, type = null){
     this[response] = ((type === null && typeof resp !== 'string') ? {'status': this.status(), 'data': [resp]} : {'status': this.status(), 'error': resp});
   }
   response() {
     return this[response];
   }
   status(){
    return this[statusCode];
   }
 }
 module.exports = v2Response;