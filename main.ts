import {App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {blocks, DEFAULT_SETTINGS, LiquibasePluginSettings, ValueSettings} from './processors'

export default class MyPlugin extends Plugin {
	settings: LiquibasePluginSettings;

	async onload() {
		await this.loadSettings();


		const bl = blocks(this.settings)
		bl.forEach((value) => {
			this.addCommand({
				id: value.name,
				name: `Insert template ${value.name}`,
				editorCallback: (editor: Editor, view: MarkdownView) => {
					editor.replaceRange(
						value.template,
						editor.getCursor()
					);
				}
			});

			this.registerMarkdownCodeBlockProcessor(value.name, value.action);
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		let settings = this.plugin.settings

		//settings
		this.createSettings(containerEl, settings.schema, value => {
				settings.schema = value
			},
			"Base"
		)
		this.createSettings(containerEl, settings.author, value => {
			settings.author = value
		})

		// changeSetPluginSettings
		let changeSetPluginSettings = this.plugin.settings.changeSetPluginSettings
		this.createSettings(containerEl, changeSetPluginSettings.dateNameConstant, value => {
				changeSetPluginSettings.dateNameConstant = value
			},
			"ChangeSet"
		)
		this.createSettings(containerEl, changeSetPluginSettings.dateType, value => {
			changeSetPluginSettings.dateType = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.numberNameConstant, value => {
			changeSetPluginSettings.numberNameConstant = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.numberType, value => {
			changeSetPluginSettings.numberType = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.textNameConstant, value => {
			changeSetPluginSettings.textNameConstant = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.textPlaceholder, value => {
			changeSetPluginSettings.textPlaceholder = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.textType, value => {
			changeSetPluginSettings.textType = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.anotherPlaceholder, value => {
			changeSetPluginSettings.anotherPlaceholder = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.anotherType, value => {
			changeSetPluginSettings.anotherType = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.requiredNameConstantTrue, value => {
			changeSetPluginSettings.requiredNameConstantTrue = value
		})
		this.createSettings(containerEl, changeSetPluginSettings.requiredNameConstantFalse, value => {
			changeSetPluginSettings.requiredNameConstantFalse = value
		})

		// addForeignKeyConstraintSettings
		let addForeignKeyConstraintSettings = this.plugin.settings.addForeignKeyConstraintSettings
		this.createSettings(containerEl, addForeignKeyConstraintSettings.constraintPrefixName, value => {
				addForeignKeyConstraintSettings.constraintPrefixName = value
			},
			"AddForeignKeyConstraint"
		)
		this.createSettings(containerEl, addForeignKeyConstraintSettings.constraintNameToLowerCase, value => {
			addForeignKeyConstraintSettings.constraintNameToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.baseTableSchemaNameToLowerCase, value => {
			addForeignKeyConstraintSettings.baseTableSchemaNameToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.baseTableNameToLowerCase, value => {
			addForeignKeyConstraintSettings.baseTableNameToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.baseColumnNamesToLowerCase, value => {
			addForeignKeyConstraintSettings.baseColumnNamesToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.referencedTableSchemaNameToLowerCase, value => {
			addForeignKeyConstraintSettings.referencedTableSchemaNameToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.referencedTableNameToLowerCase, value => {
			addForeignKeyConstraintSettings.referencedTableNameToLowerCase = value
		})
		this.createSettings(containerEl, addForeignKeyConstraintSettings.referencedColumnNamesToLowerCase, value => {
			addForeignKeyConstraintSettings.referencedColumnNamesToLowerCase = value
		})

		// addUniqueConstraintSettings
		let addUniqueConstraintSettings = this.plugin.settings.addUniqueConstraintSettings
		this.createSettings(containerEl, addUniqueConstraintSettings.uniquePrefixName, value => {
				addUniqueConstraintSettings.uniquePrefixName = value
			},
			"AddUniqueConstraint"
		)
		this.createSettings(containerEl, addUniqueConstraintSettings.constraintNameToLowerCase, value => {
			addUniqueConstraintSettings.constraintNameToLowerCase = value
		})
		this.createSettings(containerEl, addUniqueConstraintSettings.schemaNameToLowerCase, value => {
			addUniqueConstraintSettings.schemaNameToLowerCase = value
		})
		this.createSettings(containerEl, addUniqueConstraintSettings.tableNameToLowerCase, value => {
			addUniqueConstraintSettings.tableNameToLowerCase = value
		})
		this.createSettings(containerEl, addUniqueConstraintSettings.columnNamesToLowerCase, value => {
			addUniqueConstraintSettings.columnNamesToLowerCase = value
		})
	}

	createSettings(containerEl: HTMLElement, initValue: ValueSettings<any>, setSettings: (value: ValueSettings<any>) => void, headerName?: string) {
		if (headerName !== undefined) {
			new Setting(containerEl)
				.setName(headerName)
				.setHeading()
		}

		if (typeof initValue.value === 'string') {
			new Setting(containerEl)
				.setName(initValue.name)
				.setDesc(initValue.description)
				.addText(text => text
					.setPlaceholder(initValue.name)
					.setValue(initValue.value)
					.onChange(async (inValue) => {
						setSettings(
							{
								value: inValue,
								name: initValue.name,
								description: initValue.description,
							}
						)
						await this.plugin.saveSettings();
					}));
		} else if (typeof initValue.value === 'boolean') {
			new Setting(containerEl)
				.setName(initValue.name)
				.setDesc(initValue.description)
				.addToggle(toggle => toggle
					.setValue(initValue.value)
					.onChange(async (inValue) => {
						setSettings(
							{
								value: inValue.toString() === 'true',
								name: initValue.name,
								description: initValue.description,
							}
						)
						await this.plugin.saveSettings();
					}));
		}
	}
}
