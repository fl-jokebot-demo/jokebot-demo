from django.db import models

# Create your models here.

# This could be much more complex for very little gain:
#
# 1. store setup and punchline in separate models,
#    enforce unique on each model
# 2. make a joke model holding 1 setup and 1 punchline reference
#    joke model has a unique composite index on child refs
#    forcing uniqueness
#
# downside:
# complexity in read and write operations
# need to refactor the underlying database if you want sharding later
#
# upside: no duplicate data. My old DB prof would be happy

class Jokes(models.Model):
    setup     = models.CharField( max_length=4 )
    punchline = models.CharField( max_length=14 )

    class Meta:
        db_table = "jokes"
        unique_together = [['setup', 'punchline']]
