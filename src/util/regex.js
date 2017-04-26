/**
 * Returns an email address from a users message
 * @param  {String} text the users message
 * @return {Array}       array of emails found
 */
export const getEmail = text => text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

export const placeholder = () => {};
