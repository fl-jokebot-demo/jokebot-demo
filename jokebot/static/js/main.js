
/*
 function called when user requests jokebot tell a 
 joke. fetches a joke from database and begins the 
 interactive joke-telling process as joke-teller
*/
function jbd_tell()
{
   // stub
   return;
}


/*
 function called when user offers to tell jokebot a 
 joke. Begins the interactive joke-telling process 
 as joke-listener, stores joke if complete without 
 errors
*/
function jbd_listen()
{
   // stub
   return;
}


/*
 function called when user submits text input to jokebot 
 while either telling or listening to a joke.
 logic to vet input and deliver appropriate responses
 lives here.
*/
function jbd_submit()
{
   // stub
   return;
}


/*
 function called on page load to find joke count
 and enable the "tell me a joke button if we have
 any jokes in the database
*/
function jbd_joke_count( token, elem )
{

   var joke_count_promise = new Promise(function( resolve, reject )
   {
      var oXmlHttp;

      try
      {
         try
         {
            oXmlHttp=new ActiveXObject( "Microsoft.XMLHTTP" );
         }
         catch( e )
         {
	    try
            {
               oXmlHttp = new XMLHttpRequest();
            }
            catch( e )
            {
               reject( e.description );
            }
         }

         oXmlHttp.onreadystatechange=function()
         {
            if ( oXmlHttp.readyState == 4 )
            {
               if ( oXmlHttp.status == 200 )
               {
                  // we're good
                  resolve( oXmlHttp.response );
               }
               else
               {
                  reject( oXmlHttp.status.toString() );
               }
            }
         };

         oXmlHttp.open( "POST", "joke_count", true );
         oXmlHttp.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
         oXmlHttp.send( "csrfmiddlewaretoken=" + token );

      }
      catch( e )
      {
         reject( e.description );
      }

   });

   /*
     look for a count object after our
     async call is done
   */
   joke_count_promise.then(function(value)
   {

      // assume bad till we know good
      elem.style.display = "none";

      try
      {

         let j = JSON.parse( value );
         if ( j.errors != 0 )
         {
            return;
         }

         if ( j.count > 0 )
         {
            elem.style.display = "block";
         }

      }
      catch( e )
      {
         // do something inspired here
      }

   });

}
