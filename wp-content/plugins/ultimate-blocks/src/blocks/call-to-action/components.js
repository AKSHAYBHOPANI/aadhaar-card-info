const { __ } = wp.i18n;
import { Fragment } from 'react';

const {
	RichText,
	ColorPalette,
	InspectorControls,
	URLInput,
	BlockControls,
	PanelColorSettings
} = wp.blockEditor || wp.editor;

const {
	PanelBody,
	Icon,
	IconButton,
	Toolbar,
	RangeControl,
	CheckboxControl,
	ToggleControl,
	SelectControl
} = wp.components;

export const blockControls = props => {
	const { editable, attributes, setAttributes } = props;

	const { headAlign, contentAlign } = attributes;

	return (
		<BlockControls>
			{['header', 'content'].includes(editable) && (
				<Toolbar>
					{['left', 'center', 'right', 'justify']
						.slice(0, editable === 'header' ? 3 : 4)
						.map(a => (
							<IconButton
								icon={`editor-${
									a === 'justify' ? a : 'align' + a
								}`}
								label={__(
									(a !== 'justify' ? 'Align ' : '') +
										a[0].toUpperCase() +
										a.slice(1)
								)}
								isActive={
									(editable === 'header'
										? headAlign
										: contentAlign) === a
								}
								onClick={_ =>
									setAttributes(
										editable === 'header'
											? { headAlign: a }
											: {
													contentAlign: a
											  }
									)
								}
							/>
						))}
				</Toolbar>
			)}
		</BlockControls>
	);
};

export const inspectorControls = props => {
	const { attributes, setAttributes } = props;

	const {
		ctaBackgroundColor,
		ctaBorderColor,
		headFontSize,
		headColor,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		addNofollow,
		openInNewTab,
		useHeadingTag,
		selectedHeadingTag
	} = attributes;

	const headingTagOptions = [
		{ value: 'h2', label: __('H2', 'ultimate-blocks') },
		{ value: 'h3', label: __('H3', 'ultimate-blocks') },
		{ value: 'h4', label: __('H4', 'ultimate-blocks') },
		{ value: 'h5', label: __('H5', 'ultimate-blocks') },
		{ value: 'h6', label: __('H6', 'ultimate-blocks') }
	];

	return (
		<InspectorControls>
			<PanelColorSettings
				title={__('Color Settings', 'ultimate-blocks')}
				initialOpen={false}
				colorSettings={[
					{
						value: ctaBackgroundColor,
						onChange: colorValue =>
							setAttributes({
								ctaBackgroundColor: colorValue
							}),
						label: __('Background Color', 'ultimate-blocks')
					},
					{
						value: ctaBorderColor,
						onChange: colorValue =>
							setAttributes({
								ctaBorderColor: colorValue
							}),
						label: __('Border Color', 'ultimate-blocks')
					}
				]}
			/>

			<PanelBody
				title={__('Headline Settings', 'ultimate-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Font Size', 'ultimate-blocks')}
					value={headFontSize}
					onChange={value => setAttributes({ headFontSize: value })}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				{typeof useHeadingTag !== 'undefined' && (
					<ToggleControl
						label={__('Use Heading Tag', 'ultimate-blocks')}
						checked={useHeadingTag}
						onChange={_ =>
							setAttributes({ useHeadingTag: !useHeadingTag })
						}
					/>
				)}
				{useHeadingTag && (
					<SelectControl
						label={__('Select Heading Tag', 'ultimate-blocks')}
						options={headingTagOptions}
						value={selectedHeadingTag}
						onChange={selectedHeadingTag =>
							setAttributes({ selectedHeadingTag })
						}
					/>
				)}
				<p>{__('Color', 'ultimate-blocks')}</p>
				<ColorPalette
					value={headColor}
					onChange={colorValue =>
						setAttributes({ headColor: colorValue })
					}
				/>
			</PanelBody>

			<PanelBody
				title={__('Content Settings', 'ultimate-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Font Size', 'ultimate-blocks')}
					value={contentFontSize}
					onChange={value =>
						setAttributes({ contentFontSize: value })
					}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				<p>{__('Color', 'ultimate-blocks')}</p>
				<ColorPalette
					value={contentColor}
					onChange={colorValue =>
						setAttributes({
							contentColor: colorValue
						})
					}
				/>
			</PanelBody>

			<PanelBody
				title={__('Button Settings', 'ultimate-blocks')}
				initialOpen={false}
			>
				<RangeControl
					label={__('Button Width', 'ultimate-blocks')}
					value={buttonWidth}
					onChange={value => setAttributes({ buttonWidth: value })}
					min={10}
					max={500}
					beforeIcon="editor-code"
					allowReset
				/>

				<RangeControl
					label={__('Font Size', 'ultimate-blocks')}
					value={buttonFontSize}
					onChange={value => setAttributes({ buttonFontSize: value })}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				<p>{__('Button Color', 'ultimate-blocks')}</p>
				<ColorPalette
					value={buttonColor}
					onChange={colorValue =>
						setAttributes({ buttonColor: colorValue })
					}
				/>

				<p>{__('Button Text Color', 'ultimate-blocks')}</p>
				<ColorPalette
					value={buttonTextColor}
					onChange={colorValue =>
						setAttributes({
							buttonTextColor: colorValue
						})
					}
				/>
			</PanelBody>
			<PanelBody
				title={__('Link Settings', 'ultimate-blocks')}
				initialOpen={false}
			>
				<CheckboxControl
					label={__('Add Nofollow to Link', 'ultimate-blocks')}
					checked={addNofollow}
					onChange={_ => setAttributes({ addNofollow: !addNofollow })}
				/>
				<CheckboxControl
					label={__('Open Link in New Tab', 'ultimate-blocks')}
					checked={openInNewTab}
					onChange={_ =>
						setAttributes({ openInNewTab: !openInNewTab })
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export const editorDisplay = props => {
	const { isSelected, setState, attributes, setAttributes } = props;

	const {
		ctaBackgroundColor,
		ctaBorderColor,
		ctaBorderSize,
		headFontSize,
		headColor,
		headAlign,
		contentAlign,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		ub_call_to_action_headline_text,
		ub_cta_content_text,
		ub_cta_button_text,
		useHeadingTag
	} = attributes;
	return (
		<Fragment>
			<div
				className="ub_call_to_action"
				style={{
					backgroundColor: ctaBackgroundColor,
					borderWidth: ctaBorderSize + 'px',
					borderColor: ctaBorderColor
				}}
			>
				<div className="ub_call_to_action_headline">
					<RichText
						tagName={useHeadingTag ? 'h2' : 'p'}
						placeholder={__(
							'CTA Title Goes Here',
							'ultimate-blocks'
						)}
						className="ub_call_to_action_headline_text"
						style={{
							fontSize: headFontSize + 'px',
							color: headColor,
							textAlign: headAlign
						}}
						onChange={value =>
							setAttributes({
								ub_call_to_action_headline_text: value
							})
						}
						value={ub_call_to_action_headline_text}
						formattingControls={['bold', 'italic', 'strikethrough']}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => setState({ editable: 'header' })}
					/>
				</div>

				<div className="ub_call_to_action_content">
					<RichText
						tagName="p"
						placeholder={__(
							'Add Call to Action Text Here',
							'ultimate-blocks'
						)}
						className="ub_cta_content_text"
						style={{
							fontSize: contentFontSize + 'px',
							color: contentColor,
							textAlign: contentAlign
						}}
						onChange={value =>
							setAttributes({
								ub_cta_content_text: value
							})
						}
						value={ub_cta_content_text}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={_ => setState({ editable: 'content' })}
					/>
				</div>

				<div className="ub_call_to_action_button">
					<span
						className={`wp-block-button ub_cta_button`}
						style={{
							backgroundColor: buttonColor,
							width: buttonWidth + 'px'
						}}
					>
						<RichText
							tagName="p"
							placeholder={__('Button Text', 'ultimate-blocks')}
							className="ub_cta_button_text"
							style={{
								color: buttonTextColor,
								fontSize: buttonFontSize + 'px'
							}}
							onChange={value =>
								setAttributes({
									ub_cta_button_text: value
								})
							}
							value={ub_cta_button_text}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ =>
								setState({ editable: 'button' })
							}
						/>
					</span>
				</div>
			</div>
			<div className="ub_call_to_action_url_input">
				{isSelected && (
					<form
						onSubmit={event => event.preventDefault()}
						className={`editor-format-toolbar__link-modal-line ub_cta_url_input_box flex-container`}
					>
						<div className="ub-icon-holder">
							<Icon icon="admin-links" />
						</div>
						<URLInput
							autoFocus={false}
							className="button-url"
							value={props.attributes.url}
							onChange={value => setAttributes({ url: value })}
							unstableOnFocus={_ =>
								setState({ editable: 'URLInput' })
							}
						/>
						<IconButton
							icon={'editor-break'}
							label={__('Apply', 'ultimate-blocks')}
							type={'submit'}
						/>
					</form>
				)}
			</div>
		</Fragment>
	);
};
