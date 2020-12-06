from django.test import SimpleTestCase

# Create your tests here.
"""
TODO
expand these tests to verify proper data handling,
proper error handling etc. Right now they're not
really checking much of anything beyond 'file exists'
"""

class indexTests(SimpleTestCase):
    def test_index_page_status_code(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


class jokeCountTests(SimpleTestCase):
    def test_joke_count_status_code(self):
        response = self.client.get('/joke_count')
        self.assertEqual(response.status_code, 200)


class jokeStoreTests(SimpleTestCase):
    def test_index_page_status_code(self):
        response = self.client.get('/joke_store')
        self.assertEqual(response.status_code, 200)


class jokeFetchTests(SimpleTestCase):
    def test_index_page_status_code(self):
        response = self.client.get('/joke_fetch')
        self.assertEqual(response.status_code, 200)
