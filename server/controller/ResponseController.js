import validator from 'validator';

const response = Symbol('response');
const statusCode = Symbol('statusCode');

/**
 * v2Response.js:
 * Handles simple response.
 * can set response status, response message (string or array)
 * make ref to: #162088549 on PT.
 */
class ResponseController {
  /**
   *  no value is to be pasted to constructor,
   * since the class is to be inherited
   */
  constructor() {
    if (new.target === ResponseController) {
      throw new Error('Class Can\'t can be Instantiated');
    }
    this[response] = [];
    this[statusCode] = 200;
  }

  /**
   * set the response status
   * @param {number} code
   */
  setStatus(code) {
    if (validator.isNumeric(code.toString())) {
      this[statusCode] = code;
    }
  }

  /**
   * set response message
   * @param {strin/object} resp
   * @param {null/string} type
   */
  setResponse(resp, type = null) {
    this[response] = ((type === null && typeof resp !== 'string') ? { status: this.status(), data: [resp] } : { status: this.status(), error: resp });
  }

  /**
   * get response
   * @returns {array};
   */
  response() {
    return this[response];
  }

  /**
   * get response status
   * @returns {number}
   */
  status() {
    return this[statusCode];
  }
}

export default ResponseController;
