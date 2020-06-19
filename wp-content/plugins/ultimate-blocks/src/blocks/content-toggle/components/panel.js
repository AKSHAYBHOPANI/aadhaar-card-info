import icon from "../icons/icon";
import icons from "../icons/icons";

import { panel_version_1_1_9 } from "../oldVersions";
import { Component } from "react";
import { oldColorDefaults } from "./editorDisplay";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { RichText, InnerBlocks, InspectorControls, PanelColorSettings } =
	wp.blockEditor || wp.editor;

const { compose } = wp.compose;

const { withDispatch, withSelect } = wp.data;

const {
	FormToggle,
	PanelBody,
	PanelRow,
	SelectControl,
	ButtonGroup,
	Button,
	Dropdown,
} = wp.components;

const attributes = {
	index: {
		type: "number",
		default: 0,
	},
	parentID: {
		type: "string",
		default: "",
	},
	theme: {
		type: "text",
		default: "",
	},
	collapsed: {
		type: "boolean",
		default: false,
	},
	hasFAQSchema: {
		type: "boolean",
		default: false,
	},
	titleColor: {
		type: "string",
		default: "",
	},
	panelTitle: {
		type: "string",
		default: "",
	},
	newBlockPosition: {
		type: "string",
		default: "none", //changes into above/below depending on which button is clicked
	},
	titleTag: {
		type: "string",
		default: "p",
	},
	preventCollapse: {
		type: "boolean",
		default: false,
	},
	toggleLocation: {
		type: "string",
		default: "right",
	},
	toggleColor: {
		type: "string",
		default: "#000000",
	},
	toggleIcon: {
		type: "string",
		default: "chevron", //valid icons: chevron, plus, none
	},
	border: {
		type: "boolean",
		default: true,
	},
	showOnlyOne: {
		type: "boolean",
		default: false,
	},
};

class ContentTogglePanel extends Component {
	constructor(props) {
		super(props);
		this.state = { showPanel: true };
	}

	componentDidMount() {
		if (this.props.attributes.showOnlyOne && this.props.attributes.collapsed) {
			this.setState({ showPanel: false });
		}
	}

	componentWillReceiveProps(newProps) {
		const { showOnlyOne, collapsed } = newProps.attributes;
		if (showOnlyOne && collapsed !== this.props.attributes.collapsed) {
			this.setState({ showPanel: !collapsed });
		}
	}

	render() {
		const { showPanel } = this.state;

		const {
			attributes: {
				theme,
				titleColor,
				panelTitle,
				collapsed,
				hasFAQSchema,
				titleTag,
				preventCollapse,
				toggleLocation,
				toggleColor,
				toggleIcon,
				border,
				showOnlyOne,
				parentID,
			},
			setAttributes,
			removeBlock,
			block,
			blockParentId,
			selectBlock,
		} = this.props;

		const toggleIconPositions = {
			left: __("Left", "ultimate-blocks"),
			right: __("Right", "ultimate-blocks"),
		};

		if (parentID === "") {
			setAttributes({ parentID: blockParentId });
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

		return [
			<InspectorControls>
				<PanelColorSettings
					title={__("Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: theme,
							onChange: (value) => setAttributes({ theme: value }),
							label: __("Container Color"),
						},
						{
							value: titleColor,
							onChange: (value) => setAttributes({ titleColor: value }),
							label: __("Title Color"),
						},
						{
							value: toggleColor,
							onChange: (value) => setAttributes({ toggleColor: value }),
							label: __("Toggle Icon Color"),
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
							onChange={() => {
								setAttributes({ showOnlyOne: !showOnlyOne });
								if (!showOnlyOne) {
									setAttributes({ collapsed: false, preventCollapse: false });
								}
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="ub-content-toggle-state">{__("Collapsed")}</label>
						<FormToggle
							id="ub-content-toggle-state"
							label={__("Collapsed")}
							checked={collapsed}
							onChange={(_) => {
								setAttributes({ collapsed: !collapsed });
								if (showOnlyOne) {
									this.setState({ showPanel: collapsed });
								}
								if (!collapsed) {
									setAttributes({ preventCollapse: false });
								}
							}}
						/>
					</PanelRow>
					{!collapsed && !showOnlyOne && (
						<PanelRow>
							<label htmlFor="ub-content-toggle-state">
								{__("Prevent collapse")}
							</label>
							<FormToggle
								id="ub-content-toggle-state"
								label={__("Prevent collapse")}
								checked={preventCollapse}
								onChange={(_) =>
									setAttributes({ preventCollapse: !preventCollapse })
								}
							/>
						</PanelRow>
					)}
					<PanelRow>
						<label htmlFor="ub-content-toggle-border">{__("Border")}</label>
						<FormToggle
							id="ub-content-toggle-border"
							label={__("Enable border")}
							checked={border}
							onChange={(_) => setAttributes({ border: !border })}
						/>
					</PanelRow>
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
						onChange={(titleTag) => setAttributes({ titleTag })}
					/>
				</div>
				<PanelBody title={__("Toggle status icon", "ultimate-blocks")}>
					<PanelRow>
						<label htmlFor="ub-content-toggle-status-location">
							{__("Location", "ultimate-blocks")}
						</label>
						<ButtonGroup
							id="ub-content-toggle-status-location"
							aria-label={__("toggle icon position", "ultimate-blocks")}
						>
							{Object.keys(toggleIconPositions).map((p) => {
								if (
									Object.prototype.hasOwnProperty.call(toggleIconPositions, p)
								) {
									return (
										<Button
											isLarge
											aria-pressed={toggleLocation === p}
											isPrimary={toggleLocation === p}
											onClick={(_) => setAttributes({ toggleLocation: p })}
										>
											{toggleIconPositions[p]}
										</Button>
									);
								}
							})}
						</ButtonGroup>
					</PanelRow>
					<PanelRow>
						<label htmlFor="ub-content-toggle-status-icon">
							{__("Icon", "ultimate-blocks")}
						</label>
						<Dropdown
							position="bottom right"
							renderToggle={({ onToggle, isOpen }) => (
								<Button isLarge onClick={onToggle} area-expanded={isOpen}>
									{icons[toggleIcon] === "none" ? (
										<span>None</span>
									) : (
										<span className={icons[toggleIcon]} />
									)}
								</Button>
							)}
							renderContent={(_) => (
								<div className="wp-block-ub-content-toggle-customize-icons-wrap">
									{Object.keys(icons).map((i) => {
										if (Object.prototype.hasOwnProperty.call(icons, i)) {
											return (
												<Button
													isPrimary={toggleIcon === i}
													isLarge
													onClick={(_) => setAttributes({ toggleIcon: i })}
												>
													{icons[i] === "none" ? (
														"None"
													) : (
														<span className={icons[i]} />
													)}
												</Button>
											);
										}
									})}
								</div>
							)}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
			<div
				className={`wp-block-ub-content-toggle-accordion ${
					border ? "" : "no-border"
				}`}
				style={{ borderColor: theme }}
			>
				<div
					className="wp-block-ub-content-toggle-accordion-title-wrap"
					style={{ backgroundColor: theme }}
				>
					<RichText
						tagName={titleTag}
						style={{ color: titleColor }}
						className="wp-block-ub-content-toggle-accordion-title"
						value={panelTitle}
						formattingControls={["bold", "italic"]}
						onChange={(value) => setAttributes({ panelTitle: value })}
						placeholder={__("Panel Title")}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => {
							this.setState({ showPanel: true });
							selectBlock(blockParentId);
						}}
					/>
					{toggleIcon !== "none" && (
						<div
							className={
								"wp-block-ub-content-toggle-accordion-toggle-wrap " +
								toggleLocation
							}
							style={{ color: toggleColor }}
						>
							<span
								onClick={() => this.setState({ showPanel: !showPanel })}
								className={`wp-block-ub-content-toggle-accordion-state-indicator ${
									icons[toggleIcon] ? icons[toggleIcon] : ""
								} ${showPanel ? "open" : ""}`}
							/>
							<div className="wp-block-ub-content-toggle-accordion-toggle-location">
								<span
									title={__("Switch toggle location", "ultimate-blocks")}
									onClick={(_) =>
										setAttributes({
											toggleLocation:
												toggleLocation === "left" ? "right" : "left",
										})
									}
									className="dashicons dashicons-leftright"
								/>
							</div>
						</div>
					)}
				</div>
				{showPanel && (
					<div className="wp-block-ub-content-toggle-accordion-content-wrap">
						<InnerBlocks templateLock={false} />
					</div>
				)}
				<div className="wp-block-ub-content-toggle-accordion-controls-top">
					<span
						title={__("Insert New Toggle Above")}
						onClick={() => setAttributes({ newBlockPosition: "above" })}
						className="dashicons dashicons-plus-alt"
					/>
					<span
						title={__("Delete This Toggle")}
						onClick={() => removeBlock(block.clientId)}
						class="dashicons dashicons-dismiss"
					/>
				</div>
				<div className="wp-block-ub-content-toggle-accordion-controls-bottom">
					<span
						title={__("Insert New Toggle Below")}
						onClick={() => setAttributes({ newBlockPosition: "below" })}
						className="dashicons dashicons-plus-alt"
					/>
				</div>
			</div>,
		];
	}
}

registerBlockType("ub/content-toggle-panel", {
	title: __("Content Toggle Panel"),
	parent: ["ub/content-toggle"],
	icon: icon,
	category: "ultimateblocks",
	attributes,
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId),
			};
		}),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, removeBlock, selectBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return { updateBlockAttributes, removeBlock, selectBlock };
		}),
	])(ContentTogglePanel),
	save(props) {
		const { theme, collapsed, titleColor, panelTitle } = props.attributes;
		const classNamePrefix = "wp-block-ub-content-toggle";
		return (
			<div
				style={{ borderColor: theme }}
				className={`${classNamePrefix}-accordion`}
			>
				<div
					className={`${classNamePrefix}-accordion-title-wrap`}
					style={{ backgroundColor: theme }}
				>
					<RichText.Content
						tagName="span"
						className={`${classNamePrefix}-accordion-title`}
						style={{ color: titleColor }}
						value={panelTitle}
					/>
					<span
						className={
							`${classNamePrefix}-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ` +
							(collapsed ? "" : "open")
						}
					/>
				</div>
				<div
					style={{
						height: collapsed ? "0" : "",
						paddingTop: collapsed ? "0" : "",
						paddingBottom: collapsed ? "0" : "",
					}}
					className={`${classNamePrefix}-accordion-content-wrap`}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: [
		{
			attributes,
			save: panel_version_1_1_9,
		},
	],
});

registerBlockType("ub/content-toggle-panel-block", {
	title: __("Content Toggle Panel"),
	parent: ["ub/content-toggle-block"],
	icon: icon,
	category: "ultimateblocks",
	attributes,
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId),
			};
		}),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, removeBlock, selectBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return { updateBlockAttributes, removeBlock, selectBlock };
		}),
	])(ContentTogglePanel),
	save: () => <InnerBlocks.Content />,
});
