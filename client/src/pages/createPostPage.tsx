import CreatePost from "../components/general/posts/CreatePost";
import Page from "../components/layout/Page";

function createPostPage() {
  return (
    <Page title="Post details">
        <CreatePost />
    </Page>
  );
}

export default createPostPage;
