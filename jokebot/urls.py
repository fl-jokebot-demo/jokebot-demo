from django.urls import path
from .views import IndexPageView
from .views import joke_count
from .views import joke_store
from .views import joke_fetch

urlpatterns = [ 
    path( '', IndexPageView.as_view(), name='index'),
    path('joke_count', joke_count, name='joke_count'),    
    path('joke_store', joke_store, name='joke_store'),    
    path('joke_fetch', joke_fetch, name='joke_fetch'),    
]

