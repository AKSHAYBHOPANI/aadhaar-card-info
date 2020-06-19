import FeaturedImage from "./image";
import classnames from "classnames";
import moment from "moment";

// Setup the block
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { decodeEntities } = wp.htmlEntities;

export default class PostGridBlock extends Component {
	render() {
		const {
			attributes: {
				checkPostImage,
				checkPostAuthor,
				checkPostDate,
				checkPostExcerpt,
				checkPostLink,
				excerptLength,
				readMoreText,
				postLayout,
				columns,
				postTitleTag,
			},
			className,
			posts,
		} = this.props;

		const SectionTag = "section";
		const PostTag = postTitleTag;

		return [
			<Fragment>
				<SectionTag className={classnames(className, "ub-block-post-grid")}>
					<div
						className={classnames({
							"is-grid": "grid" === postLayout,
							"is-list": "list" === postLayout,
							[`columns-${columns}`]: "grid" === postLayout,
							"ub-post-grid-items": "ub-post-grid-items",
						})}
					>
						{posts.map((post, i) => (
							<article
								key={i}
								id={"post-" + post.id}
								className={classnames(
									"post-" + post.id,
									post.featured_image_src && checkPostImage
										? "has-post-thumbnail"
										: null
								)}
							>
								<Fragment>
									<div className="ub-block-post-grid-image">
										{checkPostImage && post.featured_media ? (
											<FeaturedImage
												{...this.props}
												imgID={post.featured_media}
												imgSizeLandscape={post.featured_image_src}
											/>
										) : null}
									</div>
									<div className="ub_block-post-grid-text">
										<header className="ub_block-post-grid-header">
											<PostTag className="ub-block-post-grid-title">
												<a href={post.link} target="_blank" rel="bookmark">
													{decodeEntities(post.title.rendered.trim()) ||
														__("(Untitled)", "ultimate-blocks")}
												</a>
											</PostTag>
											{checkPostAuthor && (
												<div className="ub-block-post-grid-author">
													<a
														className="ub-text-link"
														target="_blank"
														href={post.author_info.author_link}
													>
														{post.author_info.display_name}
													</a>
												</div>
											)}
											{checkPostDate && (
												<time
													dateTime={moment(post.date_gmt).utc().format()}
													className={"ub-block-post-grid-date"}
												>
													{moment(post.date_gmt)
														.local()
														.format("MMMM DD, Y", "ultimate-blocks")}
												</time>
											)}
										</header>
										<div className="ub-block-post-grid-excerpt">
											{checkPostExcerpt && (
												<div
													dangerouslySetInnerHTML={{
														__html: cateExcerpt(
															post.excerpt.rendered,
															excerptLength
														),
													}}
												/>
											)}
											{checkPostLink && (
												<p>
													<a
														className="ub-block-post-grid-more-link ub-text-link"
														href={post.link}
														target="_blank"
														rel="bookmark"
													>
														{readMoreText}
													</a>
												</p>
											)}
										</div>
									</div>
								</Fragment>
							</article>
						))}
					</div>
				</SectionTag>
			</Fragment>,
		];
	}
}

// cate excerpt
function cateExcerpt(str, no_words) {
	return str.split(" ").splice(0, no_words).join(" ");
}
