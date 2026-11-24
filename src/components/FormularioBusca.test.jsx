import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioBusca from './FormularioBusca'

describe('FormularioBusca', () => {
  it('renderiza o campo de pesquisa e o botão "Buscar na API"', () => {
    render(<FormularioBusca onBuscar={vi.fn()} carregando={false} />)

    expect(screen.getByRole('textbox', { name: /pesquisar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buscar na API' })).toBeInTheDocument()
  })

  it('atualiza o campo de pesquisa quando o usuário digita', async () => {
    const usuario = userEvent.setup()
    render(<FormularioBusca onBuscar={vi.fn()} carregando={false} />)

    const campo = screen.getByRole('textbox', { name: /pesquisar/i })
    await usuario.type(campo, 'Machado de Assis')

    expect(campo).toHaveValue('Machado de Assis')
  })

  it('chama onBuscar com o termo digitado ao clicar em "Buscar na API"', async () => {
    const usuario = userEvent.setup()
    const onBuscar = vi.fn()
    render(<FormularioBusca onBuscar={onBuscar} carregando={false} />)

    await usuario.type(
      screen.getByRole('textbox', { name: /pesquisar/i }),
      'Dom Casmurro',
    )
    await usuario.click(screen.getByRole('button', { name: 'Buscar na API' }))

    expect(onBuscar).toHaveBeenCalledTimes(1)
    expect(onBuscar).toHaveBeenCalledWith('Dom Casmurro')
  })

  it('não chama onBuscar quando o campo de pesquisa está vazio', async () => {
    const usuario = userEvent.setup()
    const onBuscar = vi.fn()
    render(<FormularioBusca onBuscar={onBuscar} carregando={false} />)

    await usuario.click(screen.getByRole('button', { name: 'Buscar na API' }))

    expect(onBuscar).not.toHaveBeenCalled()
  })

  it('não chama onBuscar quando a pesquisa contém apenas espaços', async () => {
    const usuario = userEvent.setup()
    const onBuscar = vi.fn()
    render(<FormularioBusca onBuscar={onBuscar} carregando={false} />)

    const campo = screen.getByRole('textbox', { name: /pesquisar/i })
    await usuario.type(campo, '     ')
    expect(campo).toHaveValue('     ')

    await usuario.click(screen.getByRole('button', { name: 'Buscar na API' }))

    expect(onBuscar).not.toHaveBeenCalled()
  })

  it('remove os espaços antes e depois do termo pesquisado', async () => {
    const usuario = userEvent.setup()
    const onBuscar = vi.fn()
    render(<FormularioBusca onBuscar={onBuscar} carregando={false} />)

    await usuario.type(
      screen.getByRole('textbox', { name: /pesquisar/i }),
      '  Machado de Assis  ',
    )
    await usuario.click(screen.getByRole('button', { name: 'Buscar na API' }))

    expect(onBuscar).toHaveBeenCalledTimes(1)
    expect(onBuscar).toHaveBeenCalledWith('Machado de Assis')
  })

  it('não inicia outra pesquisa enquanto uma consulta estiver em andamento', async () => {
    const usuario = userEvent.setup()
    const onBuscar = vi.fn()
    render(<FormularioBusca onBuscar={onBuscar} carregando={true} />)

    await usuario.type(
      screen.getByRole('textbox', { name: /pesquisar/i }),
      'Dom Casmurro',
    )

    const botao = screen.getByRole('button', { name: 'Buscando...' })
    expect(botao).toBeDisabled()

    await usuario.click(botao)

    expect(onBuscar).not.toHaveBeenCalled()
  })
})
