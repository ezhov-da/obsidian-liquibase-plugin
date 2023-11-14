import {MarkdownPostProcessorContext} from "obsidian";
import * as Prism from 'prismjs';

export interface ValueSettings<T> {
	value: T;
	name: string;
	description: string;
}

export interface AddUniqueConstraintSettings {
	uniquePrefixName: ValueSettings<string>;
	constraintNameToLowerCase: ValueSettings<boolean>;
	schemaNameToLowerCase: ValueSettings<boolean>;
	tableNameToLowerCase: ValueSettings<boolean>;
	columnNamesToLowerCase: ValueSettings<boolean>;
}

export interface AddForeignKeyConstraintSettings {
	constraintPrefixName: ValueSettings<string>;
	constraintNameToLowerCase: ValueSettings<boolean>;
	baseTableSchemaNameToLowerCase: ValueSettings<boolean>;
	baseTableNameToLowerCase: ValueSettings<boolean>;
	baseColumnNamesToLowerCase: ValueSettings<boolean>;
	referencedTableSchemaNameToLowerCase: ValueSettings<boolean>;
	referencedTableNameToLowerCase: ValueSettings<boolean>;
	referencedColumnNamesToLowerCase: ValueSettings<boolean>;
}

export interface ChangeSetPluginSettings {
	dateNameConstant: ValueSettings<string>;
	dateType: ValueSettings<string>;
	numberNameConstant: ValueSettings<string>;
	numberType: ValueSettings<string>;
	textNameConstant: ValueSettings<string>;
	textPlaceholder: ValueSettings<string>;
	textType: ValueSettings<string>;
	anotherPlaceholder: ValueSettings<string>;
	anotherType: ValueSettings<string>;
	requiredNameConstantTrue: ValueSettings<string>;
	requiredNameConstantFalse: ValueSettings<string>;
}

export interface LiquibasePluginSettings {
	schema: ValueSettings<string>;
	author: ValueSettings<string>;
	addUniqueConstraintSettings: AddUniqueConstraintSettings;
	addForeignKeyConstraintSettings: AddForeignKeyConstraintSettings;
	changeSetPluginSettings: ChangeSetPluginSettings;
}

export const DEFAULT_SETTINGS: LiquibasePluginSettings = {
	schema: {
		value: '${schema}',
		name: 'Database schema',
		description: 'The database schema is used in the property \'schema\'',
	},
	author: {
		value: 'user',
		name: 'Author',
		description: 'Author used for property \'author\'',
	},
	addUniqueConstraintSettings: {
		uniquePrefixName: {
			value: 'U_',
			name: 'Prefix for the name of a unique constraint',
			description: 'Prefix for the name of a unique constraint. Example: U_CONSTRAINT_NAME',
		},
		constraintNameToLowerCase: {
			value: true,
			name: 'Constraint name to lowercase',
			description: 'Whether to convert the constraint name to lowercase',
		},
		schemaNameToLowerCase: {
			value: true,
			name: 'Schema name to lowercase',
			description: 'Whether to convert the schema name to lowercase',
		},
		tableNameToLowerCase: {
			value: true,
			name: 'Table name to lowercase',
			description: 'Whether to convert the table name to lowercase',
		},
		columnNamesToLowerCase: {
			value: true,
			name: 'Columns name to lowercase',
			description: 'Whether to convert the columns name to lowercase',
		},
	},
	addForeignKeyConstraintSettings: {
		constraintPrefixName: {
			value: 'FK_',
			name: 'Prefix for the name of a foreign key constraint',
			description: 'Prefix for the name of a foreign key constraint. Example: FK_CONSTRAINT_NAME',
		},
		constraintNameToLowerCase: {
			value: true,
			name: 'Constraint name to lowercase',
			description: 'Whether to convert the constraint name to lowercase',
		},
		baseTableSchemaNameToLowerCase: {
			value: true,
			name: 'Base table schema name to lowercase',
			description: 'Whether to convert the Base table schema name to lowercase',
		},
		baseTableNameToLowerCase: {
			value: true,
			name: 'Base table name to lowercase',
			description: 'Whether to convert the base table name to lowercase',
		},
		baseColumnNamesToLowerCase: {
			value: true,
			name: 'Base column name to lowercase',
			description: 'Whether to convert the base column name to lowercase',
		},
		referencedTableSchemaNameToLowerCase: {
			value: true,
			name: 'Referenced table schema name to lowercase',
			description: 'Whether to convert the referenced table schema name to lowercase',
		},
		referencedTableNameToLowerCase: {
			value: true,
			name: 'Referenced table name to lowercase',
			description: 'Whether to convert the referenced table name to lowercase',
		},
		referencedColumnNamesToLowerCase: {
			value: true,
			name: 'Referenced column names to lowercase',
			description: 'Whether to convert the referenced column names to lowercase',
		},
	},
	changeSetPluginSettings: {
		dateNameConstant: {
			value: 'date',
			name: 'Date name to replace',
			description: 'Date name to replace. Example: \'date\'',
		},
		dateType: {
			value: 'java.sql.Types.TIMESTAMP',
			name: 'Date type',
			description: 'Example: \'java.sql.Types.TIMESTAMP\'',
		},
		numberNameConstant: {
			value: 'number',
			name: 'Number name to replace',
			description: 'Number name to replace. Example: \'number\'',
		},
		numberType: {
			value: 'java.sql.Types.NUMERIC',
			name: 'Number type',
			description: 'Example: \'java.sql.Types.NUMERIC\'',
		},
		textNameConstant: {
			value: 'text',
			name: 'Text name to replace',
			description: 'Text name to replace. Example: \'text\'',
		},
		textPlaceholder: {
			value: '___',
			name: 'Text placeholder for text type',
			description: 'Text placeholder for text type. Example: \'___\'',
		},
		textType: {
			value: 'java.sql.Types.VARCHAR(___)',
			name: 'Text type',
			description: 'Text type. Placeholder text is acceptable. Example: \'java.sql.Types.VARCHAR(___)\'',
		},
		anotherPlaceholder: {
			value: '___',
			name: 'Text placeholder for any other type',
			description: 'Text placeholder for any other type. Example: \'___\'',
		},
		anotherType: {
			value: 'java.sql.Types.___',
			name: 'Any other type',
			description: 'Any other type. Placeholder text is acceptable. Example: \'java.sql.Types.___\'',
		},
		requiredNameConstantTrue: {
			value: 'true',
			name: 'True assertion that values are required',
			description: 'True assertion that values are required. Example: \'true\'',
		},
		requiredNameConstantFalse: {
			value: 'false',
			name: 'False assertion that values are required',
			description: 'False assertion that values are required. Example: \'false\'',
		},
	}
}

export interface BlockCode {
	name: string,
	format: string,
	template: string,
	action: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>
}

class AddUniqueConstraint implements BlockCode {
	settings: LiquibasePluginSettings;

	name = 'liquibase-addUniqueConstraint';

	format = 'table_name -> column1, column2';

	template =
		`
\`\`\`${this.name}
${this.format}
\`\`\`
`

	constructor(settings: LiquibasePluginSettings) {
		this.settings = settings;
	}

	action = async (source: string, el: HTMLElement, _: MarkdownPostProcessorContext) => {
		try {
			let data: string[] = source.split("->")
			let tableName: string = data[0].trim()
			let columns: string = data[1].trim()

			let schema = this.settings.schema

			const builder = require('xmlbuilder');

			let addUniqueConstraintSettings = this.settings.addUniqueConstraintSettings
			let constraintName = this.settings.addUniqueConstraintSettings.uniquePrefixName.value + tableName

			let doc = builder
				.create('addUniqueConstraint')
				.att('constraintName', toLowerCase(addUniqueConstraintSettings.constraintNameToLowerCase.value, constraintName))
				.att('tableName', toLowerCase(addUniqueConstraintSettings.tableNameToLowerCase.value, tableName))
				.att('schemaName', toLowerCase(addUniqueConstraintSettings.schemaNameToLowerCase.value, schema.value))
				.att('columnNames', toLowerCase(addUniqueConstraintSettings.columnNamesToLowerCase.value, columns))

			let text = doc.toString({pretty: true});

			const html = Prism.highlight(text, Prism.languages.javascript, 'XML');

			let pre = el.createEl("pre")
			pre.innerHTML = html
		} catch (err) {
			console.error(err);
			el.createEl("pre", {text: `Wrong format. Valid format ${this.format}'`})
		}
	};
}

class AddForeignKeyConstraint implements BlockCode {
	settings: LiquibasePluginSettings;

	name = 'liquibase-addForeignKeyConstraint';

	format = 'table : column -> base_table : column';

	template =
		`
\`\`\`${this.name}
${this.format}
\`\`\`
`

	constructor(settings: LiquibasePluginSettings) {
		this.settings = settings;
	}

	action = async (source: string, el: HTMLElement, _: MarkdownPostProcessorContext) => {
		try {
			let fromAndTo = source.split("->")
			let from = fromAndTo[0].split(":")
			let fromTable = from[0]?.trim()
			let fromColumn = from[1]?.trim()
			let to = fromAndTo[1].split(":")
			let toTable = to[0]?.trim()
			let toColumn = to[1]?.trim()

			let schema = this.settings.schema

			const builder = require('xmlbuilder');

			let addForeignKeyConstraintSettings = this.settings.addForeignKeyConstraintSettings
			const constraintName = addForeignKeyConstraintSettings.constraintPrefixName.value + fromTable + '_' + toTable

			let doc = builder
				.create('addForeignKeyConstraint')
				.att('constraintName', toLowerCase(addForeignKeyConstraintSettings.constraintNameToLowerCase.value, constraintName))
				.att('baseTableSchemaName', toLowerCase(addForeignKeyConstraintSettings.baseTableSchemaNameToLowerCase.value, schema.value))
				.att('baseTableName', toLowerCase(addForeignKeyConstraintSettings.baseTableNameToLowerCase.value, fromTable))
				.att('baseColumnNames', toLowerCase(addForeignKeyConstraintSettings.baseColumnNamesToLowerCase.value, fromColumn))
				.att('referencedTableSchemaName', toLowerCase(addForeignKeyConstraintSettings.referencedTableSchemaNameToLowerCase.value, schema.value))
				.att('referencedTableName', toLowerCase(addForeignKeyConstraintSettings.referencedTableNameToLowerCase.value, toTable))
				.att('referencedColumnNames', toLowerCase(addForeignKeyConstraintSettings.referencedColumnNamesToLowerCase.value, toColumn))

			let text = doc.toString({pretty: true});

			const html = Prism.highlight(text, Prism.languages.javascript, 'XML');

			let pre = el.createEl("pre")
			pre.innerHTML = html // createEl("code", { text: textUnique, cls: "language-XML" })
		} catch (err) {
			console.error(err);
			el.createEl("pre", {text: `Wrong format. Valid format '${this.format}'`})
		}
	};
}

interface Table {
	name: string,
	comment: string,
	id: string,
	columns: Column[]
}

interface Column {
	name: string,
	type: string,
	isRequired: boolean,
	comment: string
}

class ChangeSet implements BlockCode {
	settings: LiquibasePluginSettings

	name = 'liquibase-changeSet';

	format = '';

	template = '';

	constructor(settings: LiquibasePluginSettings) {
		this.settings = settings;
		const textType = `${settings.changeSetPluginSettings.numberNameConstant.value}/${settings.changeSetPluginSettings.dateNameConstant.value}/${settings.changeSetPluginSettings.textNameConstant.value}5000`;
		const mandatoryType = `${settings.changeSetPluginSettings.requiredNameConstantFalse.value}/${settings.changeSetPluginSettings.requiredNameConstantTrue.value}`;
		this.format = `table_name, table description, changeSetId\ncolumn_name, type(${textType}), mandatory(${mandatoryType}), column description`
		this.template =
			`
\`\`\`${this.name}
${this.format}
\`\`\`
`
	}

	action = async (source: string, el: HTMLElement, _: MarkdownPostProcessorContext) => {
		try {
			let inputText = source
			let schema = this.settings.schema

			let table = this.parseToTable(inputText, this.settings)
			let xml = this.buildChangeSetXml(table, schema.value, this.settings)

			const html = Prism.highlight(xml, Prism.languages.javascript, 'XML');

			let pre = el.createEl("pre")
			pre.innerHTML = html // createEl("code", { text: textUnique, cls: "language-XML" })
		} catch (err) {
			console.error(err);
			el.createEl(
				"pre",
				{
					text: `Wrong format. 
			Format:
			${this.format}`
				}
			)
		}
	};

	private parseToTable(text: string, settings: LiquibasePluginSettings): Table {
		let columns: Column[] = []
		let table: Table = {
			name: '',
			comment: '',
			id: '',
			columns: columns
		}
		let array = text.trim().split("\n")
		if (array.length > 0) {
			array.forEach((line, index) => {
					if (index == 0) {
						let delimiter = ","
						let arrayTable = line.trim().split(delimiter)
						table.name = arrayTable[0].trim()
						table.comment = arrayTable[1].trim()
						if (arrayTable[2]) {
							table.id = arrayTable[2].trim()
						}
					} else {
						table.columns.push(this.parseToColumn(line, settings))
					}
				}
			)
		}

		return table
	}

	private parseToColumn(line: string, settings: LiquibasePluginSettings): Column {
		let delimiter = ","
		let array = line.split(delimiter)
		let columnName = array[0].trim()
		let columnType = array[1].trim()
		let columnRequired = array[2].trim()
		let columnComment = array[3].trim()

		return {
			name: columnName,
			type: this.convertType(columnType, settings),
			isRequired: this.convertRequired(columnRequired, settings),
			comment: columnComment
		}
	}

	private convertType(rawType: string, liquibasePluginSettings: LiquibasePluginSettings): string {
		switch (rawType) {
			case liquibasePluginSettings.changeSetPluginSettings.dateNameConstant.value:
				return liquibasePluginSettings.changeSetPluginSettings.dateType.value
			case liquibasePluginSettings.changeSetPluginSettings.numberNameConstant.value:
				return liquibasePluginSettings.changeSetPluginSettings.numberType.value
			default:
				let regexp = new RegExp("\\d+")
				if (rawType.startsWith(liquibasePluginSettings.changeSetPluginSettings.textNameConstant.value)) {
					let len = regexp.exec(rawType)?.toString() ?? ''
					return liquibasePluginSettings.changeSetPluginSettings.textType.value.replace(
						liquibasePluginSettings.changeSetPluginSettings.textPlaceholder.value, len
					)
				} else {
					return liquibasePluginSettings.changeSetPluginSettings.anotherType.value.replace(
						liquibasePluginSettings.changeSetPluginSettings.anotherPlaceholder.value, rawType
					)
				}
		}
	}

	private convertRequired(rawRequired: string, liquibasePluginSettings: LiquibasePluginSettings): boolean {
		switch (rawRequired) {
			case liquibasePluginSettings.changeSetPluginSettings.requiredNameConstantTrue.value:
				return false
			case liquibasePluginSettings.changeSetPluginSettings.requiredNameConstantFalse.value:
				return true
			default:
				throw Error("Wrong required")
		}
	}

	private buildChangeSetXml(table: Table, schema: string, settings: LiquibasePluginSettings): string {
		let builder = require('xmlbuilder');
		const nowDate = new Date()
		let id;
		if (table.id) {
			id = table.id;
		} else {
			id = `${nowDate.toISOString().split('T')[0].replace(/-/gi, '')}-___`;
		}

		let doc = builder.create('changeSet');
		doc
			.att('id', id)
			.att('author', settings.author.value)

		doc
			.ele('preConditions')
			.att('onFail', 'MARK_RAN')
			.ele('not')
			.ele('tableExists')
			.att('tableName', table.name)
			.att('schemaName', schema)

		let createTable = doc.ele('createTable')
			.att('tableName', table.name)
			.att('schemaName', schema)
			.att('remarks', table.comment)

		table.columns.forEach(value => {
			createTable
				.ele('column')
				.att('name', value.name)
				.att('type', value.type)
				.att('remarks', value.comment)
				.ele('constraints')
				.att('nullable', value.isRequired)
		})
		return doc.toString({pretty: true});
	}
}

function toLowerCase(toLowerCase: boolean, value: string): string {
	return toLowerCase ? value.toLowerCase() : value
}

export function blocks(settings: LiquibasePluginSettings): BlockCode[] {
	return [
		new AddUniqueConstraint(settings),
		new AddForeignKeyConstraint(settings),
		new ChangeSet(settings),
	]
}
