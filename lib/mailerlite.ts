const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

interface SubscriberData {
  email: string
  nome?: string
}

export async function addSubscriber(data: SubscriberData) {
  if (!MAILERLITE_API_KEY) {
    console.warn('MailerLite API key não configurada')
    return null
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email: data.email,
      fields: {
        name: data.nome || '',
      },
      groups: [],
      status: 'active',
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao adicionar subscriber no MailerLite')
  }

  return response.json()
}
