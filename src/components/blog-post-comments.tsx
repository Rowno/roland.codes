import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { AddIcon } from './icons'

interface CommentProps {
  userName: string
  avatarUrl: string
  commentsIssueId: number
  commentId: number
  bodyHtml: string
  createdAt: Date
}

export const Comment: React.FC<CommentProps> = (props) => {
  const { userName, avatarUrl, commentsIssueId, commentId, bodyHtml, createdAt } = props

  return (
    <li className="blog-post__comment">
      <div className="blog-post__comment__header">
        <a rel="nofollow" href={`https://github.com/${userName}`}>
          <img
            className="blog-post__comment__avatar"
            src={`${avatarUrl}&amp;s=30&amp;r=g`}
            srcSet={`${avatarUrl}&amp;s=60&amp;r=g 2x`}
            alt=""
          />

          <span className="blog-post__comment__name">{userName}</span>
        </a>

        <a
          className="blog-post__comment__date themed--no-color"
          rel="nofollow"
          href={`https://github.com/Rowno/roland.codes/issues/${commentsIssueId}/#issuecomment-${commentId}`}
        >
          <time dateTime={createdAt.toISOString()} title={createdAt.toISOString()}>
            {formatDistanceToNow(createdAt)} ago
          </time>
        </a>
      </div>

      <div className="blog-post__comment__content" dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>
    </li>
  )
}

interface GitHubComment {
  author_association: string
  body_html: string
  created_at: string
  html_url: string
  id: number
  issue_url: string
  node_id: string
  updated_at: string
  url: string
  user: GitHubUser
}

interface GitHubUser {
  avatar_url: string
  events_url: string
  followers_url: string
  following_url: string
  gists_url: string
  gravatar_id: string
  html_url: string
  id: number
  login: string
  node_id: string
  organizations_url: string
  received_events_url: string
  repos_url: string
  site_admin: boolean
  starred_url: string
  subscriptions_url: string
  type: string
  url: string
}

async function loadComments(commentsIssueId: number): Promise<GitHubComment[]> {
  const response = await fetch(`https://api.github.com/repos/Rowno/roland.codes/issues/${commentsIssueId}/comments`, {
    headers: {
      Accept: 'application/vnd.github.v3.html+json',
    },
  })

  if (response.status !== 200) {
    throw new Error(response.statusText)
  }

  return (await response.json()) as GitHubComment[]
}

interface BlogPostCommentsProps {
  commentsIssueId: number
}

export const BlogPostComments: React.FC<BlogPostCommentsProps> = ({ commentsIssueId }) => {
  const [comments, setComments] = useState<GitHubComment[]>()
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasErrored, setHasErrored] = useState(false)
  const hasComments = (comments?.length ?? 0) > 0

  useEffect(() => {
    loadComments(commentsIssueId)
      .then(setComments)
      .catch((error) => {
        setHasErrored(true)
        throw error
      })
      .finally(() => setHasLoaded(true))
  }, [commentsIssueId])

  return (
    <div className="blog-post__comments">
      <h2 className="blog-post__comments__title" id="comments">
        GitHub Comments
      </h2>

      {!hasLoaded && !hasErrored && <div className="blog-post__comments__list">Loading...</div>}
      {hasLoaded && !hasErrored && hasComments && (
        <ol className="blog-post__comments__list">
          {comments?.map((comment) => (
            <Comment
              key={comment.id}
              userName={comment.user.login}
              avatarUrl={comment.user.avatar_url}
              commentsIssueId={commentsIssueId}
              commentId={comment.id}
              bodyHtml={comment.body_html}
              createdAt={new Date(comment.created_at)}
            />
          ))}
        </ol>
      )}
      {hasLoaded && !hasErrored && !hasComments && <div className="blog-post__comments__list">No comments yet. 😞</div>}
      {hasErrored && (
        <div className="blog-post__comments__list">
          Oops, something broke while loading the comments. Please try again later or{' '}
          <a href="https://github.com/Rowno/roland.codes/issues/">report the problem</a>.
        </div>
      )}

      <a
        className="blog-post__comments__add"
        href={`https://github.com/Rowno/roland.codes/issues/${commentsIssueId}`}
        itemProp="discussionUrl"
      >
        <AddIcon />
        add comment via GitHub
      </a>
    </div>
  )
}
