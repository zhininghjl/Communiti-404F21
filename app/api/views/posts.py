from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Author, Post, visibility_type
from api.serializers import PostSerializer
from api.utils import generate_id, methods
from Social_network.settings import HOSTNAME
from django.contrib.auth.decorators import login_required
from datetime import datetime

# References
# https://www.django-rest-framework.org/tutorial/2-requests-and-responses/
# https://www.django-rest-framework.org/api-guide/viewsets/
# https://www.django-rest-framework.org/tutorial/3-class-based-views/#rewriting-our-api-using-class-based-views


class PostViewSet(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated]

    """
    Creation URL ://service/author/{AUTHOR_ID}/posts/
    GET: get recent posts of author (paginated)
    POST: create a new post but generate a post_id
    """
    # TODO get valid author id
    @action(methods=[methods.GET], detail=True)
    def get_author_post(self, request, author_id):
        """ list author posts """
        # return 401 response if the author does not exists
        if self.check_author_by_id(author_id) is False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # get all posts that is owned by the author
        queryset = Post.objects.filter(
            authorID=author_id).order_by('-published')
        serializer = PostSerializer(queryset, many=True)
        if serializer.is_valid:
            return Response(serializer.data)
        else:
            # return 400 response if the data was invalid/missing require field
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=[methods.POST], detail=True)
    def create_post_with_new_id(self, request, author_id):
        """ create a post """
        # DO NOT REMOVE this is a useful code
        # if self.check_author_by_id(author_id) is False:
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            instance = Post(postID=generate_id())
            self.populate_post_data(serializer.data, instance)
            return Response(PostSerializer(instance).data, status=status.HTTP_200_OK)
        else:
            # return 400 response if the data was invalid/missing require field
            return Response(status=status.HTTP_400_BAD_REQUEST)

    """
    URL: ://service/author/{AUTHOR_ID}/posts/{POST_ID}
    GET: get a public post by post_id
    POST: update the post (must be authenticated)
    DELETE: remove the author's post
    PUT: create a post with that post_id
    """
    @action(methods=[methods.GET], detail=True)
    def get_public_post(self, request, author_id, post_id):
        """ list public postS """
        # return 404 response if the post_id does not exists
        if self.check_post_by_id(post_id) is False:
            return Response(status=status.HTTP_404_NOT_FOUND)

        queryset = Post.objects.filter(
            postID=post_id, visibility=visibility_type.PUBLIC)
        serializer = PostSerializer(queryset, many=True)
        if serializer.is_valid:
            return Response(serializer.data)
        else:
            # return 400 response if the data was invalid/missing require field
            return Response(status=status.HTTP_404_NOT_FOUND)

    def create_post_with_existing_id(self, request):
        # TODO
        pass

    # TODO get valid author id

    @action(methods=[methods.DELETE], detail=True)
    def delete_post(self, request, author_id, post_id):
        # return 4xx response if neither author nor post exists
        if self.check_post_by_id(author_id) is False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if self.check_post_by_id(post_id) is False:
            return Response(status=status.HTTP_404_NOT_FOUND)

        Post.objects.get(postID=post_id).delete()
        return Response(status=status.HTTP_200_OK)

    # TODO get valid author id
    @action(methods=[methods.POST], detail=True)
    def update_post(self, request, author_id, post_id):
        # return 4xx response if neither author nor post exists
        if self.check_post_by_id(author_id) is False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if self.check_post_by_id(post_id) is False:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            instance = Post(postID=post_id)
            self.populate_post_data(serializer.data, instance)
            return Response(PostSerializer(instance).data, status=status.HTTP_200_OK)
        else:
            # return 400 response if the data was invalid/missing require field
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def check_author_by_id(self, author_id):
        """ check existence of an author """
        try:
            if Author.objects.get(authorID=author_id):
                return True
        except Author.DoesNotExist:
            return False

    def check_post_by_id(self, post_id):
        """ check existence of a post """
        try:
            if Post.objects.get(postID=post_id):
                return True
        except:
            return False

    def populate_post_data(self, data, instance):
        """ put request data into instance 
        auto-set fields: post_id, type, visibility, unlisted, count

        example of an working data:

        {
        "title": "my title",
        "source": "https://uofa-cmput404.github.io/",
        "origin": "https://uofa-cmput404.github.io/",
        "description": "my des",
        "contentType": "text/plain",
        "content": "my content",
        "categories": ["web", "tutorial"]
        }

        """

        instance.title = data["title"]
        # DO NOT REMOVE uncomment field in this method
        instance.source = data["source"]  # TODO make it to url
        instance.origin = data["origin"]  # TODO make it to url
        instance.description = data["description"]
        instance.contentType = data["contentType"]
        instance.content = data["content"]
        # instance.author = author_id
        instance.categories = data["categories"]
        # instance.count = len(data["comment"])  # total number of comments for this post
        instance.published = datetime.now().isoformat()
        # instance.visibility = data["visibility"]
        # instance.unlisted = data["unlisted"]
        instance.save()
