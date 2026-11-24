import { useState } from 'react'
import FormularioBusca from './components/FormularioBusca'

export default function App() {
  const [carregando, setCarregando] = useState(false)
  const [livros, setLivros] = useState([])
  const [erro, setErro] = useState('')

  async function buscar(termo) {
    setCarregando(true)
    setErro('')

    try {
      const resposta = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=10`,
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar a OpenLibrary.')
      }

      const dados = await resposta.json()
      setLivros(dados.docs ?? [])
    } catch (erroBusca) {
      setErro(erroBusca.message)
      setLivros([])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main>
      <h1>OpenLibrary</h1>
      <p>Busque livros pelo título.</p>

      <FormularioBusca onBuscar={buscar} carregando={carregando} />

      {erro && <p role="alert">{erro}</p>}

      <ul>
        {livros.map((livro) => (
          <li key={livro.key}>
            {livro.title}
            {livro.author_name?.length ? ` — ${livro.author_name[0]}` : ''}
          </li>
        ))}
      </ul>
    </main>
  )
}
