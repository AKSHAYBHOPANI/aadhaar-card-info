import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove,
} from "react-sortable-hoc";
import Inspector from "./inspector";
import { Component } from "react";
import { upgradeButtonLabel, mergeRichTextArray } from "../../../common";

const { __ } = wp.i18n;
const { createBlock } = wp.blocks;
const { RichText, InnerBlocks, BlockControls } = wp.blockEditor || wp.editor;

const { Toolbar, IconButton } = wp.components;

export class OldTabHolder extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			replaceBlock,
		} = this.props;

		const className = "wp-block-ub-tabbed-content";

		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		let block = null;

		for (const bl of window.ubTabbedContentBlocks) {
			if (bl.id === attributes.id) {
				block = bl;
				break;
			}
		}

		if (!block) {
			block = {
				id: window.ubTabbedContentBlocks.length,
				SortableItem: null,
				SortableList: null,
			};
			window.ubTabbedContentBlocks.push(block);
			setAttributes({ id: block.id });
		}

		if (!attributes.tabsTitle) {
			attributes.tabsTitle = [];
		}

		const tabs = this.props.block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({ activeControl: type + "-" + index });
			setAttributes({ activeTab: index });

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, {
					isActive: index === i,
				});
			});
		};

		const addTab = (i) => {
			insertBlock(createBlock("ub/tab", {}), i, this.props.block.clientId);
			attributes.tabsTitle[i] = { content: "Tab Title" };
			setAttributes({ tabsTitle: attributes.tabsTitle });

			setAttributes({ activeTab: i });

			showControls("tab-title", i);
		};

		if (attributes.tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		if (!block.SortableItem) {
			block.SortableItem = SortableElement(
				({ value, i, propz, onChangeTitle, onRemoveTitle, toggleTitle }) => (
					<div
						className={
							className +
							"-tab-title-wrap SortableItem" +
							(propz.attributes.activeTab === i ? " active" : "")
						}
						style={{
							backgroundColor:
								propz.attributes.activeTab === i
									? propz.attributes.theme
									: "initial",
							color:
								propz.attributes.activeTab === i
									? propz.attributes.titleColor
									: "#000000",
						}}
						onClick={() => toggleTitle("tab-title", i)}
					>
						<RichText
							tagName="div"
							className={className + "-tab-title "}
							value={value.content}
							formattingControls={["bold", "italic"]}
							isSelected={
								propz.attributes.activeControl === "tab-title-" + i &&
								propz.isSelected
							}
							onChange={(content) => onChangeTitle(content, i)}
							placeholder="Tab Title"
						/>
						<div className="ub-tab-actions">
							<DragHandle />
							<span
								className={
									"dashicons dashicons-minus remove-tab-icon" +
									(propz.attributes.tabsTitle.length === 1 ? " ub-hide" : "")
								}
								onClick={() => onRemoveTitle(i)}
							/>
						</div>
					</div>
				)
			);
		}

		if (!block.SortableList) {
			block.SortableList = SortableContainer(
				({
					items,
					propz,
					onChangeTitle,
					onRemoveTitle,
					toggleTitle,
					onAddTab,
				}) => (
					<div className={className + "-tabs-title SortableList"}>
						{items.map((value, index) => (
							<block.SortableItem
								propz={propz}
								key={`item-${index}`}
								i={index}
								index={index}
								value={value}
								onChangeTitle={onChangeTitle}
								onRemoveTitle={onRemoveTitle}
								toggleTitle={toggleTitle}
							/>
						))}
						<div
							className={className + "-tab-title-wrap"}
							key={propz.attributes.tabsTitle.length}
							onClick={() => onAddTab(propz.attributes.tabsTitle.length)}
						>
							<span className="dashicons dashicons-plus-alt" />
						</div>
					</div>
				)
			);
		}

		const newArrangement = JSON.stringify(
			tabs.map((tab) => tab.attributes.index)
		);

		if (newArrangement !== oldArrangement) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: attributes.activeTab === i,
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (selectedBlock && selectedBlock.clientId !== this.props.block.clientId) {
			if (
				tabs.filter((innerblock) => innerblock.attributes.isActive).length === 0
			) {
				showControls("tab-title", tabs.length - 1);
			}
			if (
				tabs.filter((tab) => tab.clientId === selectedBlock.clientId).length >
					0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(this.props.block.clientId);
			}
		}

		return [
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div className={className}>
				<button
					onClick={() => {
						const {
							activeControl,
							activeTab,
							theme,
							titleColor,
							tabsTitle,
						} = this.props.block.attributes;
						replaceBlock(
							this.props.block.clientId,
							createBlock(
								"ub/tabbed-content-block",
								{
									activeControl,
									activeTab,
									theme,
									titleColor,
									tabsTitle: tabsTitle
										.map((title) => title.content)
										.map((title) =>
											Array.isArray(title) ? mergeRichTextArray(title) : title
										),
								},
								this.props.block.innerBlocks.map((innerBlock, i) =>
									createBlock(
										"ub/tab-block",
										{
											index: i,
											isActive: innerBlock.attributes.isActive,
										},
										innerBlock.innerBlocks
									)
								)
							)
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				<div className={className + "-holder"}>
					<block.SortableList
						axis="x"
						propz={this.props}
						items={attributes.tabsTitle}
						onSortEnd={({ oldIndex, newIndex }) => {
							const titleItems = attributes.tabsTitle.slice(0);

							setAttributes({
								tabsTitle: arrayMove(titleItems, oldIndex, newIndex),
							});

							moveBlockToPosition(
								tabs.filter((tab) => tab.attributes.index === oldIndex)[0]
									.clientId,
								this.props.block.clientId,
								this.props.block.clientId,
								newIndex
							);

							showControls("tab-title", oldIndex);
							setAttributes({ activeTab: newIndex });
						}}
						useDragHandle={true}
						onChangeTitle={(content, i) => {
							attributes.tabsTitle[i].content = content;
						}}
						onRemoveTitle={(i) => {
							setAttributes({
								tabsTitle: [
									...attributes.tabsTitle.slice(0, i),
									...attributes.tabsTitle.slice(i + 1),
								],
							});

							removeBlock(
								tabs.filter((tab) => tab.attributes.index === i)[0].clientId
							);

							setAttributes({ activeTab: 0 });
							showControls("tab-title", 0);
						}}
						toggleTitle={showControls}
						onAddTab={addTab}
					/>

					<div className={className + "-tabs-content"}>
						<InnerBlocks templateLock={false} allowedBlocks={["ub/tab"]} />
					</div>
				</div>
			</div>,
		];
	}
}

export class TabHolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: -1,
		};
	}

	componentDidMount() {
		const { attributes, setAttributes } = this.props;
		const { tabsTitle, tabsTitleAlignment } = attributes;

		if (tabsTitle.length !== tabsTitleAlignment.length) {
			setAttributes({
				tabsTitleAlignment: Array(tabsTitle.length).fill("center"),
			});
		}
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.checkWidth);
	}
	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			block,
			blockID,
		} = this.props;

		const {
			tabsTitle,
			tabsTitleAlignment,
			activeTab,
			tabVertical,
		} = attributes;

		const blockPrefix = "wp-block-ub-tabbed-content";

		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		let bl = null;

		for (const b of window.ubTabbedContentBlocks) {
			if (b.id === this.state.index) {
				bl = b;
				break;
			}
		}

		if (!bl) {
			bl = {
				id: window.ubTabbedContentBlocks.length,
				SortableItem: null,
				SortableList: null,
			};
			window.ubTabbedContentBlocks.push(bl);
			this.setState({ index: bl.id });
		}

		const tabs = block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({
				activeControl: `${type}-${index}`,
				activeTab: index,
			});

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, {
					isActive: index === i,
				});
			});
		};

		const addTab = (i) => {
			insertBlock(createBlock("ub/tab-block", {}), i, block.clientId);
			setAttributes({
				tabsTitle: [...tabsTitle, "Tab Title"],
				tabsTitleAlignment: [...tabsTitleAlignment, "left"],
				activeTab: i,
			});

			showControls("tab-title", i);
		};

		if (tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		if (!bl.SortableItem) {
			bl.SortableItem = SortableElement(
				({ value, i, props, onChangeTitle, onRemoveTitle, toggleTitle }) => {
					const {
						tabsTitle,
						tabsTitleAlignment,
						activeTab,
						theme,
						titleColor,
						activeControl,
					} = props.attributes;
					return (
						<div
							className={`${blockPrefix}-tab-title-${
								tabVertical ? "vertical-" : ""
							}wrap SortableItem${activeTab === i ? " active" : ""}`}
							style={{
								textAlign: tabsTitleAlignment[i],
								backgroundColor: activeTab === i ? theme : "initial",
								color: activeTab === i ? titleColor : "#000000",
							}}
							onClick={() => toggleTitle("tab-title", i)}
						>
							<RichText
								tagName="div"
								className={`${blockPrefix}-tab-title`}
								value={value}
								formattingControls={["bold", "italic"]}
								isSelected={activeControl === `tab-title-${i}` && isSelected}
								onChange={(newTitle) => onChangeTitle(newTitle, i)}
								placeholder="Tab Title"
							/>
							<div
								className={`ub-tab-actions${
									tabsTitle.length === 1 ? " ub-hide" : ""
								}`}
							>
								<DragHandle />
								<span
									className={"dashicons dashicons-minus remove-tab-icon"}
									onClick={(_) => onRemoveTitle(i)}
								/>
							</div>
						</div>
					);
				}
			);
		}

		if (!bl.SortableList) {
			bl.SortableList = SortableContainer(
				({
					items,
					props,
					onChangeTitle,
					onRemoveTitle,
					onAddTab,
					toggleTitle,
				}) => {
					const { tabsAlignment, tabVertical, tabsTitle } = props.attributes;
					return (
						<div
							className={`${blockPrefix}-tabs-title${
								tabVertical ? "-vertical-tab" : ""
							} SortableList`}
							style={{
								justifyContent:
									tabsAlignment === "center"
										? "center"
										: `flex-${tabsAlignment === "left" ? "start" : "end"}`,
							}}
							useWindowAsScrollContainer={true}
						>
							{items.map((value, index) => (
								<bl.SortableItem
									key={`item-${index}`}
									i={index}
									index={index}
									value={value}
									props={props}
									onChangeTitle={onChangeTitle}
									onRemoveTitle={onRemoveTitle}
									toggleTitle={toggleTitle}
								/>
							))}
							<div
								className={`${blockPrefix}-tab-title-${
									tabVertical ? "vertical-" : ""
								}wrap`}
								key={tabsTitle.length}
								onClick={() => onAddTab(tabsTitle.length)}
							>
								<span className="dashicons dashicons-plus-alt" />
							</div>
						</div>
					);
				}
			);
		}

		const newArrangement = tabs.map((tab) => tab.attributes.index);

		if (!newArrangement.every((i, j) => i === oldArrangement[j])) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: activeTab === i,
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (selectedBlock && selectedBlock.clientId !== block.clientId) {
			if (
				tabs.filter((innerblock) => innerblock.attributes.isActive).length === 0
			) {
				showControls("tab-title", tabs.length - 1);
			}
			if (
				tabs.filter((tab) => tab.clientId === selectedBlock.clientId).length >
					0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(block.clientId);
			}
		}

		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						{["left", "center", "right"].map((a) => (
							<IconButton
								icon={`editor-align${a}`}
								label={__(`Align Tab Title ${a[0].toUpperCase() + a.slice(1)}`)}
								isActive={tabsTitleAlignment[activeTab] === a}
								onClick={() =>
									setAttributes({
										tabsTitleAlignment: [
											...tabsTitleAlignment.slice(0, activeTab),
											a,
											...tabsTitleAlignment.slice(activeTab + 1),
										],
									})
								}
							/>
						))}
					</Toolbar>
					<Toolbar>
						{["left", "center", "right"].map((a) => (
							<IconButton
								icon={`align-${a}`}
								label={__(`Align Tabs ${a[0].toUpperCase() + a.slice(1)}`)}
								onClick={() => setAttributes({ tabsAlignment: a })}
							/>
						))}
					</Toolbar>
				</BlockControls>
			),
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div className={blockPrefix}>
				<div
					className={`${blockPrefix}-holder ${
						tabVertical ? "vertical-holder" : ""
					}`}
				>
					<div
						className={`${blockPrefix}-tab-holder ${
							tabVertical ? "vertical-tab-width" : ""
						}`}
					>
						<bl.SortableList
							props={this.props}
							axis={tabVertical ? "y" : "x"}
							items={tabsTitle}
							onSortEnd={({ oldIndex, newIndex }) => {
								const titleItems = tabsTitle.slice(0);
								showControls("tab-title", oldIndex);
								setAttributes({
									tabsTitle: arrayMove(titleItems, oldIndex, newIndex),
									activeTab: newIndex,
								});

								moveBlockToPosition(
									tabs.filter((tab) => tab.attributes.index === oldIndex)[0]
										.clientId,
									block.clientId,
									block.clientId,
									newIndex
								);
							}}
							onChangeTitle={(content, i) => {
								attributes.tabsTitle[i] = content;
							}}
							onRemoveTitle={(i) => {
								setAttributes({
									tabsTitle: [
										...tabsTitle.slice(0, i),
										...tabsTitle.slice(i + 1),
									],
									tabsTitleAlignment: [
										...tabsTitleAlignment.slice(0, i),
										...tabsTitleAlignment.slice(i + 1),
									],
									activeTab: 0,
								});

								removeBlock(
									tabs.filter((tab) => tab.attributes.index === i)[0].clientId
								);

								showControls("tab-title", 0);
							}}
							onAddTab={addTab}
							toggleTitle={showControls}
							useDragHandle={true}
						/>
					</div>
					<div
						className={`${blockPrefix}-tabs-content ${
							tabVertical ? "vertical-content-width" : ""
						}`}
					>
						<InnerBlocks
							templateLock={false}
							allowedBlocks={["ub/tab-block"]}
						/>
					</div>
				</div>
			</div>,
		];
	}
}
