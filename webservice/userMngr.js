/*
 * Check auth is used to provide the userid of a user provided in "authorization" field
 * 
 * _parameters:_
 *     sqlcomm: the mysql object to the database
 *     head: HTTP headers provided by the client
 *     outfun: the function that manages the answer to client
 *          (two parameter: an int value
 *          first param: http error code
 *          second param: the user ID if http code ==200)
 *
 * _return value:_
 *     this is a void function
 *
 * */

var verifyUser = function(sqlconn, head, outfun) {
  if ("authorization" in head)
  {	
    var n=head["authorization"].indexOf(":");
    if ((n<0)||(n>=head["authorization"].length-1))
    {
      outfun(401,0);
    }
    var login=head["authorization"].substr(0, n);
    var reqmdp=head["authorization"].substr(n+1);
    var getUserQuery = "SELECT userid, mdp, MD5(CONCAT(seed," + sqlconn.escape(reqmdp) + ")) as reqmdp FROM usertable WHERE login="+ sqlconn.escape(login);
    sqlconn.query(getUserQuery, function(err, rows, fields)
    {
      if (err)
      {
        outfun(500,0);
      }
      if (rows.length==0)
      {
        outfun(401,0);
      }
      else if (rows.length>1)
      {
        outfun(500,0);
      }
      else
      {
        if (rows[0]["reqmdp"]===rows[0]["mdp"])
        {
          outfun(200,rows[0]["userid"]);
        }
        else
        {
          outfun(401,0);
        }
      }
    });
  }
  else
  {
    outfun(401,0);
  }
}

exports.verifyUser=verifyUser;
