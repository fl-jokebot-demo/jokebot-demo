from django.http import HttpResponse
from django.views.generic import TemplateView

# Create your views here.
class IndexPageView(TemplateView):
    template_name = 'index.html'


def joke_count(request):
    """
    TODO stub - replace
    pull the number of jokes stored
    """
    return HttpResponse( "joke_count stub" )


def joke_store(request):
    """
    TODO stub - replace
    store the joke if well formed and not duplicate
    """
    return HttpResponse( "joke_store stub" )


def joke_fetch(request):
    """
    TODO stub - replace
    pull a random joke if any are stored
    TODO later, allow user to pass in selection
    critera such as ordinal or keyword
    """
    return HttpResponse( "joke_fetch stub" )
