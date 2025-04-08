<template>
	<div
		ref="codeEditBox"
		class="codeEditBox"
		:class="heightChange&&'codeEditBox1'"
	/>
</template>
<script lang="ts">
import {
	defineComponent, onBeforeUnmount, onMounted, ref, watch,
} from 'vue'

import * as monaco from 'monaco-editor'
import { editorProps } from './MonacoEditorType'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

export default defineComponent({
	name: 'StratoCodeBlock',
	props: editorProps,
	emits: ['update:modelValue', 'change', 'editor-mounted'],
	setup(props, { emit }) {
		// noinspection JSUnusedGlobalSymbols
		window.MonacoEnvironment = {
			getWorker(_: string, label: string) {
				return new EditorWorker()
			},
		}
		let editor: any
		const codeEditBox = ref()

		const init = () => {
			monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: true,
				noSyntaxValidation: false,
			})
			monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
				target: monaco.languages.typescript.ScriptTarget.ES2020,
				allowNonTsExtensions: true,
			})

			monaco.editor.defineTheme('strato-dark', {
				rules: [],
				base: 'vs-dark',
				inherit: true,
				colors: {
					'editor.background': '#0a0a0a'
				}
			})

			editor = monaco.editor.create(codeEditBox.value, {
				value: props.modelValue,
				language: props.language,
				readOnly: props.readOnly,
				theme: props.theme,
				...props.options,
			})

			// 监听值的变化
			editor.onDidChangeModelContent(() => {
				const value = editor.getValue() // 给父组件实时返回最新文本
				emit('update:modelValue', value)
				emit('change', value)
			})

			emit('editor-mounted', editor)
		}
		watch(
			() => props.modelValue,
			(newValue) => {
				if (editor) {
					const value = editor.getValue()
					if (newValue !== value) {
						editor.setValue(newValue)
					}
				}
			},
		)

		watch(
			() => props.options,
			(newValue) => {
				editor.updateOptions(newValue)
			},
			{ deep: true },
		)
		watch(
			() => props.readOnly,
			() => {
				console.log('props.readOnly', props.readOnly)
				editor.updateOptions({ readOnly: props.readOnly })
			},
			{ deep: true },
		)

		watch(
			() => props.language,
			(newValue) => {
				monaco.editor.setModelLanguage(editor.getModel()!, newValue)
			},
		)

		onBeforeUnmount(() => {
			editor.dispose()
		})

		onMounted(() => {
			init()
		})

		return { codeEditBox }
	},
})
</script>
<style lang="scss" scoped>
.codeEditBox {
	width: 100%;
	flex: 1;
	min-height: 300px;
	// height: 200px;
	overflow-y: auto;
}
.codeEditBox1{
	height: calc(100% - 323px);
}
</style>
