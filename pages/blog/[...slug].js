import Container from '../../blog/components/container'
import MoreStories from '../../blog/components/more-stories'
import HeroPost from '../../blog/components/hero-post'
import Intro from '../../blog/components/intro'
import Layout from '../../blog/components/layout'
import { getAllPostsForHome, getCategories } from '../../blog/lib/api'
import Head from 'next/head'
import Categories from '../../blog/components/categories'
import { getBlogContext } from '../../blog/lib/utils'

export default function Index({ preview, allPosts, categories, locale, category }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Inverse Finance Blog</title>
        </Head>
        <Container>
          <Intro />
          <Categories categories={categories} locale={locale} active={category} />    
          {heroPost && (
            <HeroPost
              {...heroPost}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ preview = false, ...context }) {
  const { locale, category } = getBlogContext(context);
  const allPosts = await getAllPostsForHome(preview, locale, category) ?? []
  const categories = await getCategories(preview, locale) ?? []
  return {
    props: { preview, allPosts, categories, locale, category },
  }
}
