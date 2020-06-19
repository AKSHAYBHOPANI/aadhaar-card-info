import Inspector from "./inspector";
import { Component } from "react";
import {
	upgradeButtonLabel,
	getDescendantBlocks,
	objectsMatch,
} from "../../../common";

const objectsNewChange = (obj1, obj2) => {
	let diff = {};
	if (obj1 && obj2) {
		Object.keys(obj1).forEach((key) => {
			if (obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
				diff = Object.assign(diff, { [key]: obj2[key] });
			}
		});
		return diff;
	}
	return null;
};

const { __ } = wp.i18n;
const { createBlock } = wp.blocks;

const { InnerBlocks, InspectorControls, PanelColorSettings } =
	wp.blockEditor || wp.editor;
const { PanelBody, PanelRow, FormToggle, SelectControl } = wp.components;

export class OldPanelContent extends Component {
	constructor(props) {
		super(props);
		this.getPanels = this.getPanels.bind(this);
	}
	getPanels() {
		return this.props.block.innerBlocks;
	}
	render() {
		const {
			attributes,
			setAttributes,
			className,
			isSelected,
			updateBlockAttributes,
			oldArrangement,
			mainBlockSelected,
			setState,
			selectBlock,
			insertBlock,
			removeBlock,
			selectedBlock,
			parentOfSelectedBlock,
			block,
			replaceBlock,
		} = this.props;

		const { collapsed, theme, titleColor } = attributes;

		const panels = this.getPanels();

		const newArrangement = JSON.stringify(
			panels.map((panel) => panel.attributes.index)
		);

		const newBlockTarget = panels.filter(
			(panel) => panel.attributes.newBlockPosition !== "none"
		);

		const onThemeChange = (value) => {
			setAttributes({ theme: value });

			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, { theme: value })
			);
		};

		const onTitleColorChange = (value) => {
			setAttributes({ titleColor: value });

			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, { titleColor: value })
			);
		};

		const onCollapseChange = () => {
			setAttributes({ collapsed: !collapsed });
			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, {
					collapsed: !panel.attributes.collapsed,
				})
			);
		};

		//Detect if one of the child blocks has received a command to add another child block
		if (newBlockTarget.length > 0) {
			const { index, newBlockPosition } = newBlockTarget[0].attributes;
			insertBlock(
				createBlock("ub/content-toggle-panel", {
					theme: theme,
					collapsed: collapsed,
					titleColor: titleColor,
				}),
				newBlockPosition === "below" ? index + 1 : index,
				block.clientId
			);
			updateBlockAttributes(newBlockTarget[0].clientId, {
				newBlockPosition: "none",
			});
		}

		//Fix indexes in case of rearrangments

		if (newArrangement !== oldArrangement) {
			if (oldArrangement === "[0]" && newArrangement === "[]") {
				removeBlock(block.clientId);
			} else {
				panels.forEach((panel, i) =>
					updateBlockAttributes(panel.clientId, {
						index: i,
						parent: block.clientId,
					})
				);
				setState({ oldArrangement: newArrangement });
			}
		} else if (mainBlockSelected) {
			const childBlocks = this.getPanels()
				.filter((block) => block.name === "ub/content-toggle-panel")
				.map((panels) => panels.clientId);
			if (
				selectedBlock !== block.clientId &&
				childBlocks.includes(selectedBlock)
			) {
				setState({ mainBlockSelected: false });
			}
		} else {
			selectBlock(parentOfSelectedBlock);
			setState({ mainBlockSelected: true });
		}

		return [
			isSelected && (
				<Inspector
					{...{
						attributes,
						onThemeChange,
						onCollapseChange,
						onTitleColorChange,
					}}
				/>
			),
			<div className={className}>
				<button
					onClick={() => {
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/content-toggle-block",
								{ collapsed, theme, titleColor },
								block.innerBlocks.map((innerBlock, i) =>
									createBlock(
										"ub/content-toggle-panel-block",
										{
											index: i,
											theme,
											collapsed,
											titleColor,
											panelTitle: innerBlock.attributes.panelTitle,
											newBlockPosition: innerBlock.attributes.newBlockPosition,
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
				<InnerBlocks
					template={[["ub/content-toggle-panel"]]} //initial content
					templateLock={false}
					allowedBlocks={["ub/content-toggle-panel"]}
				/>
			</div>,
		];
	}
}

export const oldColorDefaults = {
	theme: "#f63d3d",
	titleColor: "#ffffff",
};

export class PanelContent extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			attributes: {
				collapsed,
				theme,
				titleColor,
				blockID,
				hasFAQSchema,
				titleTag,
				preventCollapse,
				toggleLocation,
				toggleColor,
				toggleIcon,
				border,
				showOnlyOne,
			},
			setAttributes,
			className,
			isSelected,
			updateBlockAttributes,
			oldArrangement,
			oldAttributeValues,
			mainBlockSelected,
			setState,
			selectBlock,
			insertBlock,
			removeBlock,
			selectedBlock,
			block,
		} = this.props;

		const panels = this.props.block.innerBlocks;

		const newArrangement = panels.map((panel) => panel.attributes.index);

		const newBlockTarget = panels.filter(
			(panel) => panel.attributes.newBlockPosition !== "none"
		);

		const onThemeChange = (value) => {
			setAttributes({ theme: value });

			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, { theme: value })
			);
		};

		const onTitleColorChange = (value) => {
			setAttributes({ titleColor: value });

			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, { titleColor: value })
			);
		};

		const onCollapseChange = (_) => {
			setAttributes({ collapsed: !collapsed });
			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, {
					collapsed: !panel.attributes.collapsed,
				})
			);
			if (!collapsed) {
				setAttributes({ preventCollapse: false });
				panels.forEach((panel) =>
					updateBlockAttributes(panel.clientId, {
						preventCollapse: false,
					})
				);
			}
		};

		const onPreventCollapseChange = (_) => {
			setAttributes({ preventCollapse: !preventCollapse });
			panels.forEach((panel) =>
				updateBlockAttributes(panel.clientId, {
					preventCollapse: !panel.attributes.preventCollapse,
				})
			);
		};

		const newColorDefaults = {
			theme: "#f1f1f1",
			titleColor: "#000000",
		};

		//Detect if one of the child blocks has received a command to add another child block
		if (newBlockTarget.length > 0) {
			const { index, newBlockPosition } = newBlockTarget[0].attributes;
			insertBlock(
				createBlock("ub/content-toggle-panel-block", {
					theme,
					collapsed: showOnlyOne ? true : collapsed,
					titleColor,
					titleTag,
					preventCollapse,
					toggleLocation,
					toggleColor,
					toggleIcon,
					border,
					showOnlyOne,
				}),
				newBlockPosition === "below" ? index + 1 : index,
				block.clientId
			);
			updateBlockAttributes(newBlockTarget[0].clientId, {
				newBlockPosition: "none",
			});
		}

		if (newArrangement.length === 0) {
			if (oldArrangement.length > 0) {
				removeBlock(block.clientId);
				return null; //prevent block from being rendered to prevent error
			} else {
				insertBlock(
					createBlock("ub/content-toggle-panel-block", {
						theme: newColorDefaults.theme,
						collapsed,
						titleColor: newColorDefaults.titleColor,
						hasFAQSchema,
						toggleLocation,
						toggleColor,
						toggleIcon,
						border,
						showOnlyOne,
					}),
					0,
					block.clientId
				);
				setState({ oldArrangement: Array.from(Array(panels.length).keys()) });
			}
		} else if (!newArrangement.every((item, i) => item === oldArrangement[i])) {
			//Fix indexes in case of rearrangments
			if (newArrangement.length < oldArrangement.length && showOnlyOne) {
				if (!panels.map((p) => p.attributes.collapsed).includes(false)) {
					oldArrangement.forEach((i) => {
						if (!newArrangement.includes(i)) {
							updateBlockAttributes(panels[Math.max(0, i - 1)].clientId, {
								collapsed: false,
							});
						}
					});
				}
			}
			panels.forEach((panel, i) =>
				updateBlockAttributes(panel.clientId, {
					index: i,
					parent: block.clientId,
				})
			);
			setState({ oldArrangement: newArrangement });
		} else if (mainBlockSelected) {
			if (
				selectedBlock !== block.clientId &&
				getDescendantBlocks(this.props.block)
					.map((d) => d.clientId)
					.includes(selectedBlock)
			) {
				setState({ mainBlockSelected: false });
			}
		} else {
			const childBlocks = this.props.block.innerBlocks
				.filter((block) => block.name === "ub/content-toggle-panel-block")
				.map((panels) => panels.clientId);

			if (childBlocks.includes(selectedBlock) && !wp.data.useDispatch) {
				//useDispatch is only present in Gutenberg v5.9, together with clickthrough selection feature
				setState({ mainBlockSelected: true });
				selectBlock(this.props.block.clientId);
			}
		}

		if (blockID === "") {
			setAttributes(
				Object.assign({ blockID: block.clientId }, newColorDefaults)
			);
		} else {
			let presets = {};
			if (theme === "") {
				presets = Object.assign(presets, { theme: oldColorDefaults.theme });
			}
			if (titleColor === "") {
				presets = Object.assign(presets, {
					titleColor: oldColorDefaults.titleColor,
				});
			}
		}

		let newAttributeValues;

		if (oldArrangement.length === 0) {
			setState({
				oldAttributeValues: panels.map((panel) =>
					((
						{
							panelTitle,
							newBlockPosition,
							index,
							parent,
							parentID,
							...others
						} = panel.attributes
					) => others)()
				),
			});
		} else {
			newAttributeValues = panels.map((panel) =>
				((
					{
						panelTitle,
						newBlockPosition,
						index,
						parent,
						parentID,
						...others
					} = panel.attributes
				) => others)()
			);

			if (newAttributeValues.length > 0) {
				if (newAttributeValues.length === oldAttributeValues.length) {
					if (
						!newAttributeValues.every((entry, i) =>
							objectsMatch(entry, oldAttributeValues[i])
						)
					) {
						//add exception for changing collapsed to matching for index when showOnlyOne is changed to true
						//when showOnlyOne is true and collapsed state is changed in one of the panels,

						const changedPanel = block.innerBlocks
							.map((innerBlock) => innerBlock.clientId)
							.indexOf(selectedBlock);

						const newChange = objectsNewChange(
							oldAttributeValues[changedPanel],
							newAttributeValues[changedPanel]
						);
						if (
							changedPanel > -1 && //for preventing errors in gutenberg 8
							newAttributeValues[changedPanel].showOnlyOne
						) {
							//value of collapsed should be true for changedpanel and false for parent and all otherpanels
							panels.forEach((panel, i) => {
								updateBlockAttributes(
									panel.clientId,
									Object.assign({}, newChange, {
										collapsed: i !== changedPanel,
									})
								);
							});
							setAttributes(Object.assign({ collapsed: false }, newChange));
						} else {
							panels.forEach((panel) => {
								updateBlockAttributes(panel.clientId, newChange);
							});
							setAttributes(newChange);
						}

						setState({ oldAttributeValues: newAttributeValues });
					}
				} else {
					setState({ oldAttributeValues: newAttributeValues });
				}
			}
		}

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__("Color Scheme")}
						initialOpen={false}
						colorSettings={[
							{
								value: theme,
								onChange: onThemeChange,
								label: __("Container Color"),
							},
							{
								value: titleColor,
								onChange: onTitleColorChange,
								label: __("Title Color"),
							},
						]}
					/>
					<PanelBody title={__("Initial State")} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-content-toggle-amount">
								{__("Show only one panel at a time")}
							</label>
							<FormToggle
								id="ub-content-toggle-amount"
								label={__("Show only one panel at a time")}
								checked={showOnlyOne}
								onChange={(_) => {
									setAttributes({ showOnlyOne: !showOnlyOne });
									panels.forEach((panel, i) =>
										updateBlockAttributes(panel.clientId, {
											showOnlyOne: !showOnlyOne,
										})
									);
									if (showOnlyOne) {
										//value before setAttributes still in use
										setAttributes({ collapsed: false, preventCollapse: false });
										panels.forEach((panel) =>
											updateBlockAttributes(panel.clientId, {
												collapsed: false,
												preventCollapse: false,
											})
										);
									} else {
										panels.forEach((panel, i) =>
											updateBlockAttributes(panel.clientId, {
												collapsed: i === 0,
											})
										);
									}
								}}
							/>
						</PanelRow>
						{!showOnlyOne && (
							<PanelRow>
								<label htmlFor="ub-content-toggle-state">
									{__("Collapsed")}
								</label>
								<FormToggle
									id="ub-content-toggle-state"
									label={__("Collapsed")}
									checked={collapsed}
									onChange={onCollapseChange}
								/>
							</PanelRow>
						)}
						{!collapsed && !showOnlyOne && (
							<PanelRow>
								<label htmlFor="ub-content-toggle-state">
									{__("Prevent collapse")}
								</label>
								<FormToggle
									id="ub-content-toggle-state"
									label={__("Prevent collapse")}
									checked={preventCollapse}
									onChange={onPreventCollapseChange}
								/>
							</PanelRow>
						)}
					</PanelBody>
					<PanelBody title={__("FAQ Schema")} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-content-toggle-faq-schema">
								{__("Enable FAQ Schema")}
							</label>
							<FormToggle
								id="ub-content-toggle-faq-schema"
								label={__("Enable FAQ Schema")}
								checked={hasFAQSchema}
								onChange={(_) =>
									setAttributes({
										hasFAQSchema: !hasFAQSchema,
									})
								}
							/>
						</PanelRow>
					</PanelBody>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "5fr 1fr",
							padding: "0 16px",
						}}
					>
						<p>{__("Select Heading Tag", "ultimate-blocks")}</p>
						<SelectControl
							options={[
								{ value: "h1", label: __("H1", "ultimate-blocks") },
								{ value: "h2", label: __("H2", "ultimate-blocks") },
								{ value: "h3", label: __("H3", "ultimate-blocks") },
								{ value: "h4", label: __("H4", "ultimate-blocks") },
								{ value: "h5", label: __("H5", "ultimate-blocks") },
								{ value: "h6", label: __("H6", "ultimate-blocks") },
								{ value: "p", label: __("P", "ultimate-blocks") },
							]}
							value={titleTag}
							onChange={(titleTag) => {
								setAttributes({ titleTag });
								panels.forEach((panel) =>
									updateBlockAttributes(panel.clientId, {
										titleTag,
									})
								);
							}}
						/>
					</div>
				</InspectorControls>
			),
			<div className={className}>
				<InnerBlocks
					templateLock={false}
					allowedBlocks={["ub/content-toggle-panel-block"]}
				/>
			</div>,
		];
	}
}
