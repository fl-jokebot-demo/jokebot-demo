from django.http import HttpResponse
from django.views.generic import TemplateView
from jokebot.models import Joke

import json

# Create your views here.
class IndexPageView(TemplateView):
    template_name = 'index.html'


def joke_count(request):
    """
    pull the number of jokes stored
    """
    count  = 0;
    errors = 0;

    try:

        count = Joke.objects.all().count()

    except:

        # we might like to see error logging or handling here
        errors = 1;

    finally:

        try:

            retval = { 'errors': errors, 'count': count }
            retval = json.dumps( retval )

        except:

            # we REALLY might like to see error logging or handling here
            # or at least set a 5xx code for the response object
            pass

        finally:

           return HttpResponse( retval )


def joke_store(request):
    """
    TODO stub - replace
    store the joke if well formed and not duplicate
    """

    errors = 0

    try:

        # check setup
        s = request.POST["setup"]

        #assert len
        assert ( len( s ) > 0 )
        assert ( len( s ) < 50 )

        #check punchline
        p = request.POST["punchline"]

        #assert len
        assert ( len( p ) > 0 )
        assert ( len( p ) < 250 )

        # write to model
        j=Joke( setup=s, punchline=p )
        j.save()

    except:

        errors = 1

    finally:

        retval = { 'errors': errors }
        retval = json.dumps( retval )
        return HttpResponse( retval )


def joke_fetch(request):
    """
    TODO stub - replace
    pull a random joke if any are stored
    TODO later, allow user to pass in selection
    critera such as ordinal or keyword
    """
    return HttpResponse( "joke_fetch stub" )
