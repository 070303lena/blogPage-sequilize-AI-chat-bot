import PostPageItem from "../components/general/posts/PostPageItem";
import Page from "../components/layout/Page";

function PostPage() {
    return (
        <Page title="Posts Page">
            <div className="flex flex-col bg-white p-5 gap-5 rounded-lg w-full max-w-250 min-h-[25vh] overflow-auto">
                <PostPageItem />
            </div>
        </Page>
    )
}

export default PostPage;
