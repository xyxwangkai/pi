import { openAICompletionsApi } from "../api/openai-completions.lazy.ts";
import { envApiKeyAuth } from "../auth/helpers.ts";
import { createProvider, type Provider } from "../models.ts";
import type { Model } from "../types.ts";
import { getProviderEnvValue } from "../utils/provider-env.ts";

const DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

function getArkEndpointId(): string | undefined {
	return getProviderEnvValue("ARK_ENDPOINT_ID") ?? getProviderEnvValue("ARK_MODEL_ID");
}

function getArkModels(): Model<"openai-completions">[] {
	const baseUrl = getProviderEnvValue("ARK_BASE_URL") ?? DEFAULT_ARK_BASE_URL;
	const modelId = getArkEndpointId();
	if (!modelId) {
		return [];
	}
	const modelName = getProviderEnvValue("ARK_MODEL_NAME") ?? modelId;

	return [
		{
			id: modelId,
			name: modelName,
			api: "openai-completions",
			provider: "ark",
			baseUrl,
			reasoning: false,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
			},
			compat: {
				supportsStore: false,
				supportsDeveloperRole: false,
				supportsReasoningEffort: false,
				maxTokensField: "max_tokens",
			},
			contextWindow: 262144,
			maxTokens: 16384,
		},
	];
}

export function arkProvider(): Provider<"openai-completions"> {
	return createProvider({
		id: "ark",
		name: "Ark",
		baseUrl: getProviderEnvValue("ARK_BASE_URL") ?? DEFAULT_ARK_BASE_URL,
		auth: { apiKey: envApiKeyAuth("Ark API key", ["ARK_API_KEY"]) },
		models: getArkModels(),
		api: openAICompletionsApi(),
	});
}
