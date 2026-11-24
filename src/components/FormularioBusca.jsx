import { useState } from 'react'

export default function FormularioBusca({ onBuscar, carregando = false }) {
  const [termo, setTermo] = useState('')

  function handleSubmit(evento) {
    evento.preventDefault()

    if (carregando) {
      return
    }

    const termoLimpo = termo.trim()

    if (!termoLimpo) {
      return
    }

    onBuscar?.(termoLimpo)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="termo-pesquisa">Pesquisar</label>
      <input
        id="termo-pesquisa"
        type="text"
        value={termo}
        onChange={(evento) => setTermo(evento.target.value)}
        placeholder="Digite o título de um livro"
      />

      <button type="submit" disabled={carregando}>
        {carregando ? 'Buscando...' : 'Buscar na API'}
      </button>
    </form>
  )
}
