# Test report — V11.2.6 RC1

## Base utilizada
V11.2.5.2 congelada desta conversa. Auditoria independente aceita como histórico informado pelo usuário; verificação própria de diff e suítes reexecutada.
SHA-256 base: `99336e6dfb7c74364e7456de5f8e2a47357b5ad62489ac4a59d342b153b8267d`

## Arquivos realmente modificados/criados
Original V11.2.5.2 preservado. Novo HTML RC e cópia idêntica index; manifest RC; sw.js revisado a partir do pacote local V11.2.5; ícones reutilizados sem modificar bytes; cinco documentos RC, licença e evidências QA. Nenhum cadastro real utilizado, apagado ou migrado durante o empacotamento.

## Alterações de código
Somente condição/opções de registro SW no HTML. Worker de distribuição passa de cache-first a rede primeiro, precache verificado, escopo isolado e tolerância a falha de cache online. Funções operacionais permaneceram iguais após normalizar textos de versão. Não houve refatoração do app.

## Alterações somente de versão
Título, diagnóstico, backup/nome exportado, textos e rodapé PDF identificam V11.2.6 RC1. Schema 113 inalterado. Manifest usa nome RC, start_url relativo index.html, scope/id ./, standalone, MIME PNG e dimensões 192/512. Ícones não foram rotulados maskable sem validação apropriada.

## Testes executados e quantidade real
- 106/106 regressão em UTC; mesmos 106/106 repetidos em America/Sao_Paulo.
- 21/21 arquivamento/histórico/sessões/diagnóstico.
- 29/29 persistência/hotfix.
- 14/14 microfix/diagnóstico/meta/textos.
- 19/19 testes PWA: caminhos/arquivos/ícones, cache versionado, rejeição de HTML de outra versão, limpeza seletiva, atualização online, fallback offline/500, 404, exclusões POST/origem/escopo/dados, ausência de ativação forçada, falhas de cache.
- 5/5 testes RC: startup sem SW, file/HTTP inseguro sem registro, HTTPS relativo com rejeição de registro não fatal, duplicação com pessoa arquivada bloqueada.
Total dessas suítes: **194 verificações nomeadas**, com sobreposição temática. Uma das 106 executa os 26 autotestes internos; não foram adicionados novamente ao total.
- Mais cinco verificações de recursos em HTTP local real: index, manifest, sw e dois PNG, todos 200, bytes correspondentes e MIME corretos.
- Sintaxe de app/SW aprovada. Comparação estática do código e inspeção de versionamento.

Reexecutados cenários solicitados: instalação de dados limpa simulada, IDs/migração, cadastros/histórico/arquivamento, duplicação, backups/snapshots/transação/rollback, dark/light cru/JSON, meta inválido, falha getItem/setItem/quota, HE 0/30/60/61, 44h/excedente, 5º/6º/7º, interjornada 11h/10h59, noturno e domingo/segunda/bordas, feriados/datas especiais, contextos históricos/futuros, PDFs semanal/especial e nomes longos/paginação. PDFs foram gerados pelas funções reais no Node; não houve redesign.

## Ambiente utilizado
Node VM com DOM, storage, locks, BroadcastChannel e Cache API simulados; canvas nativo de QA. HTTP temporário Python em 127.0.0.1, servido em subdiretório, acessado por cliente HTTP e encerrado depois. Nenhuma publicação externa. Respostas HTTP: text/html, application/manifest+json, text/javascript e image/png.

## Testes não executados
**Navegador real não disponível para este fluxo local. Android/PWA instalada pendentes.** O ambiente anterior recusou HTML local no navegador remoto e não tinha Chromium local; não foi feito contorno dessa restrição. O teste HTTP não executa JavaScript nem service worker real. Sem screenshots, cliques reais, instalação física, BFCache, perda real de processo, quota Chrome, offline/atualização real, download Android ou impressão. Não há declaração de Android aprovado, PWA homologada, produção aprovada ou persistência física confirmada.

## Regressões encontradas
Nenhuma falha nas suítes finais; nenhum teste anterior removido ou expectativa flexibilizada. Scripts herdados só tiveram caminhos de saída ajustados. Novo teste dedicado também confirma bloqueio da duplicação com arquivado.

## Correções realizadas na preparação
Worker anterior cache-first podia continuar servindo HTML antigo em navegações online. Rede primeiro e revalidação evitam essa retenção pelo worker RC. Falha do Cache Storage não impede resposta online. Não encontrado defeito funcional que exigisse alteração das regras do aplicativo.

## Riscos restantes
- Servidor/CDN pode entregar release velho ou publicação parcial; instalação verifica marcador RC, mas a operação de publicação futura precisa validar hashes/cabeçalhos e pacote completo.
- Abas abertas mantêm o código carregado; worker aguardando depende de fechamento de todos os clientes. Não há atualização forçada durante edição.
- Uma primeira instalação incompleta não garante offline. Navegador pode remover cache/dados, e rede lenta pode atrasar navegação porque não há timeout artificial.
- Origem/perfil distintos não compartilham dados. Não usar múltiplas aplicações CBSI no mesmo escopo; a limpeza distingue família e escopo, não projetos que deliberadamente compartilham ambos.
- Dados corrompidos são preservados, não reconstruídos. Persistem limites documentados do backup e da proteção de sessões.
- Regras de Sem Programação, múltiplas atribuições/refeição, arquivamento postos/turnos e validação RH/jurídica permanecem pendentes.

## Pendências para homologação Android
Executar integralmente ANDROID_TEST_PLAN após auditoria independente e publicação controlada posterior. Checklist deixa browser/Android/PWA física PENDENTE. RC é candidato pronto para homologação de campo, não aceite de produção.

## Hashes
HTML avulso e index: `b620ee17ceb920f01be8122d8f3dda1b745e5a112298431c491ba330b15a79eb`

ZIP final: registrado no relatório externo e SHA256SUMS.txt após compactação; não autorreferenciado no conteúdo do ZIP.
