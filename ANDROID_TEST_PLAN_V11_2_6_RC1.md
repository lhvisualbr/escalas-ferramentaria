# Homologação Android — V11.2.6 RC1

Todos os testes físicos estão PENDENTES. Executar apenas após publicação controlada autorizada e com dados fictícios/backup externo.

Aparelho: ____ Android: ____ Chrome: ____ URL: ____ Data: ____ Responsável: ____

| Ação | Resultado esperado | Resultado obtido | PASS/FAIL | Evidência |
|---|---|---|---|---|
| 1. **Primeiro acesso HTTPS** — Abrir URL controlada, após futura publicação, online. | App abre sem erros; URL e subpasta corretas. | ____ | PENDENTE | ____ |
| 2. **Diagnóstico** — Abrir Gestão → Diagnóstico. | V11.2.6 RC1, schema 113; registrar backend/erros, sem presumir persistência. | ____ | PENDENTE | ____ |
| 3. **Instalação PWA** — Instalar pelo Chrome e abrir pelo ícone. | Nome/ícone corretos; janela standalone. Se opção não existir, registrar FAIL. | ____ | PENDENTE | ____ |
| 4. **Cadastro fictício** — Criar Pessoa Teste RC1. | Cadastro salvo sem erro. | ____ | PENDENTE | ____ |
| 5. **Fechamento completo** — Fechar abas e janela PWA. | Todas encerradas; não limpar dados do site. | ____ | PENDENTE | ____ |
| 6. **Reabertura** — Abrir pelo ícone. | Aplicativo utilizável e versão RC1. | ____ | PENDENTE | ____ |
| 7. **Persistência** — Pesquisar Pessoa Teste RC1. | Pessoa permanece após reabertura; backend local. | ____ | PENDENTE | ____ |
| 8. **Posto** — Criar Posto Teste RC1. | Posto listado. | ____ | PENDENTE | ____ |
| 9. **Turno** — Criar ADM 07:30–17:18 e Noite 22:00–06:00. | Horários distintos preservados; refeição diária de 1h nos cálculos existentes. | ____ | PENDENTE | ____ |
| 10. **Colaborador** — Criar segunda pessoa com nome semelhante. | Cadastros distintos e busca sem misturá-los. | ____ | PENDENTE | ____ |
| 11. **Programação** — Selecionar semana de ensaio e atribuir ADM à pessoa. | Dia/semana corretos; salvar e reabrir atribuição. | ____ | PENDENTE | ____ |
| 12. **HE 0/30/60** — Aplicar sucessivamente 0, 30, 60 min. | Saída 17:18 / 17:48 / 18:18 e cargas 8h48 / 9h18 / 9h48. | ____ | PENDENTE | ____ |
| 13. **HE 61** — Tentar salvar 61 min. | Bloqueio, última atribuição válida preservada. | ____ | PENDENTE | ____ |
| 14. **5º e 6º dia** — Programar cinco e depois seis dias consecutivos. | 5º alerta; 6º permite com alerta. Excedente de 44h sinalizado, não bloqueado só por carga. | ____ | PENDENTE | ____ |
| 15. **7º dia** — Tentar sétimo dia consecutivo. | Bloqueado, inclusive ao incluir retroativamente o primeiro dia. | ____ | PENDENTE | ____ |
| 16. **Interjornada** — Em ensaio, terminar 20:00 e iniciar 07:00; depois mudar início para 06:59. | Com referência 11h: primeiro permite; segundo bloqueia. Repetir com HE reduzindo descanso. | ____ | PENDENTE | ____ |
| 17. **Mudança de semana** — Testar noturno domingo→segunda e alternar semanas histórica/futura. | Conflitos/descanso consideram bordas; seleção e dados coerentes. | ____ | PENDENTE | ____ |
| 18. **Arquivar/reativar** — Arquivar pessoa utilizada, conferir histórico, tentar nova atribuição; reativar. | Histórico mantido, nova atribuição bloqueada enquanto arquivada; reativação permite. | ____ | PENDENTE | ____ |
| 19. **Segunda aba** — Abrir mesma URL em segunda aba; depois fechar todas e reabrir uma. | Proteção de sessão, sem gravações concorrentes. Reabertura única operacional. | ____ | PENDENTE | ____ |
| 20. **PDF semanal** — Selecionar quarta 17/03/2027 e gerar com HE/nomes longos. | Semanal da semana selecionada; texto pesquisável, nomes completos e paginação legível. | ____ | PENDENTE | ____ |
| 21. **PDF especial** — Selecionar sábado 11/01/2025; repetir domingo/feriado/data cadastrada. | Especial da data selecionada, nunca substituída silenciosamente por hoje. | ____ | PENDENTE | ____ |
| 22. **Download** — Localizar PDFs em Downloads e abrir em leitor. | Arquivos PDF, conteúdo e datas corretos, sem cortes. | ____ | PENDENTE | ____ |
| 23. **Backup** — Exportar e localizar JSON em Downloads. | version V11.2.6 RC1, schema 113, exportedAt e dados presentes. | ____ | PENDENTE | ____ |
| 24. **Restauração** — Em perfil de ensaio restaurar backup válido; depois tentar JSON inválido. | Válido restaura IDs/settings/histórico; inválido rejeitado sem substituir dados. | ____ | PENDENTE | ____ |
| 25. **Reabertura após restauração** — Fechar tudo e reabrir. | Conjunto restaurado permanece íntegro. | ____ | PENDENTE | ____ |
| 26. **Modo offline** — Após shell instalado/controlado, ativar modo avião e reabrir URL/ícone. | App abre offline; cadastro de ensaio, programação e PDF funcionam. Registrar estado do SW. | ____ | PENDENTE | ____ |
| 27. **Retorno online** — Desativar modo avião e reabrir. | App opera; dados offline permanecem, sem sincronização remota. | ____ | PENDENTE | ____ |
| 28. **Atualização futura** — Após auditoria, publicar próximo pacote de ensaio completo com cache novo; manter RC aberto editando. | Sem reload forçado; salvar e exportar, fechar TODAS as janelas e reabrir online. Diagnóstico mostra versão nova, dados preservados; repetir offline. | ____ | PENDENTE | ____ |

Se houver perda de dados, PDF da data incorreta, gravação concorrente ou regra operacional violada: interromper, preservar arquivos e registrar passos, horário, screenshots e backup de ensaio. Não corrigir apagando dados.
