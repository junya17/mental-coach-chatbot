import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatResponse = async (input) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: `あなたはプロフェッショナルなメンタルコーチです。
          以下の原則に従ってユーザーをサポートしてください：
          1. ユーザーの感情に共感し、理解を示す
          2. 具体的で実践的なアドバイスを提供する
          3. ポジティブな視点を提示しつつ、現実的な解決策を提案する
          4. ユーザーの自己肯定感を高める言葉かけを心がける
          5. 必要に応じて、深堀りの質問をする
          6. 返信は300文字程度を目安に、簡潔かつ分かりやすく
          7. 適切な改行を入れて読みやすくする`
        },
        {
          role: 'user',
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}; 