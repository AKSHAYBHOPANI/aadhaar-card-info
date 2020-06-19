import { ExpandRoot } from "./components";

import icon from "./icon";

const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { RichText, InnerBlocks, BlockControls, AlignmentToolbar } =
	wp.blockEditor || wp.editor;

const { withSelect, withDispatch } = wp.data;

const { compose } = wp.compose;

registerBlockType("ub/expand", {
	title: __("Expand"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Preview"), __("Hidden Content")],
	attributes: {
		blockID: {
			type: "string",
			default: ""
		},
		initialShow: {
			type: "boolean",
			default: false
		},
		toggleAlign: {
			type: "string",
			default: "left"
		}
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getSelectedBlockClientId } =
				select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				getSelectedBlockClientId
			};
		}),
		withDispatch(dispatch => {
			const { updateBlockAttributes, insertBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock
			};
		})
	])(ExpandRoot),

	save: _ => <InnerBlocks.Content />
});

registerBlockType("ub/expand-portion", {
	title: __("Expand Portion"),
	parent: "ub/expand",
	icon: icon,
	category: "ultimateblocks",
	supports: {
		inserter: false
	},
	attributes: {
		clickText: {
			type: "string",
			default: ""
		},
		displayType: {
			type: "string",
			default: ""
		},
		isVisible: {
			type: "boolean",
			default: true
		},
		toggleAlign: {
			type: "string",
			default: "left"
		}
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				getBlock,
				getBlockRootClientId
			};
		}),
		withDispatch(dispatch => ({
			updateBlockAttributes: (
				dispatch("core/block-editor") || dispatch("core/editor")
			).updateBlockAttributes
		}))
	])(function(props) {
		const {
			attributes,
			setAttributes,
			isSelected,
			block,
			updateBlockAttributes,
			getBlock,
			getBlockRootClientId
		} = props;
		const { clickText, displayType, isVisible, toggleAlign } = attributes;

		const parentBlockID = getBlockRootClientId(block.clientId);

		return [
			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={toggleAlign} //attribute from parent can't be directly used
						onChange={newAlignment => {
							updateBlockAttributes(parentBlockID, {
								toggleAlign: newAlignment
							});

							getBlock(parentBlockID).innerBlocks.forEach(innerBlock =>
								updateBlockAttributes(innerBlock.clientId, {
									toggleAlign: newAlignment
								})
							);
						}}
						controls={["left", "center", "right"]}
					></AlignmentToolbar>
				</BlockControls>
			),
			<div
				className={`ub-expand-portion ub-expand-${displayType}${
					displayType === "full" && !isVisible ? " ub-hide" : ""
				}`}
			>
				<InnerBlocks templateLock={false} />
				<RichText
					style={{ textAlign: toggleAlign }} //attribute from parent can't be directly used
					value={clickText}
					onChange={value => setAttributes({ clickText: value })}
					placeholder={__(
						`Text for show ${displayType === "full" ? "less" : "more"} button`
					)}
				/>
			</div>
		];
	}),
	save: _ => <InnerBlocks.Content />
});
