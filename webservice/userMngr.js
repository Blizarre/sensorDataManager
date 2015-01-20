/*
 * Check auth is used to provide the userid of a user provided in 
 * 
 * _parameters:_
 *     sqlcomm: the mysql object to the database
 *     head: HTTP headers provided by the client
 *     outfun: the function that manages the answer to client
 *          (one parameter: an int value
 *          passes -1 for misformated header
 *          passes -2 for incorrect auth values
 *          passes -3 for server side error
 *          otherwise passes X where X is the userid of the header
 *
 * _return value:_
 *     this is a void function
 *
 * */

var getUserId = function(sqlconn, head, outfun) {
    if ("authorization" in head)
    {	
	try {
	    var n=head["authorization"].indexOf(":");
	    if ((n<0)||(n>=head["authorization"].length-1))
	    {
		outfun(-1);
	    }
	    var login=head["authorization"].substr(0, n);
	    var reqmdp=head["authorization"].substr(n+1);
  	    var getUserQuery = "SELECT userid, mdp, MD5(CONCAT(seed," + sqlconn.escape(reqmdp) + ")) as reqmdp FROM usertable WHERE login="+ sqlconn.escape(login);
	    sqlconn.query(getUserQuery, function(err, rows, fields)
	    {
		if (err) throw err;
		if (rows.length==0)
		{
		    outfun(-2);
		}
		else if (rows.length>1)
		{
		    outfun(-3);
		}
		else
		{
		    if (rows[0]["reqmdp"]==rows[0]["mdp"])
		    {
            	        outfun(rows[0]["userid"]);
		    }
		    else
		    {
		        outfun(-2);
		    }
		}
	    });
  	   }
	catch(err) {
	    console.log(err);
            outfun(-3);
	}
    }
    else
    {
        outfun(-1);
    }
}

exports.getUserId = getUserId;
