# Escalas CBSI — V11.2.6 RC1

**Candidato pronto para homologação de campo. Não homologado em Android, PWA instalada ou produção.**

## Conteúdo
HTML avulso para inspeção/local e pasta `Escalas_CBSI_V11_2_6_RC1_PWA` pronta para futura hospedagem HTTPS. Dentro dela: index.html, manifest.webmanifest, sw.js, icons/icon-192.png, icons/icon-512.png, licença e documentação. Index e HTML avulso têm os mesmos bytes.

Nenhum site foi publicado. Depois da auditoria independente, a publicação controlada deverá disponibilizar o conteúdo completo da pasta em um mesmo diretório HTTPS. Não publicar apenas o HTML. Os caminhos suportam uma subpasta como `/repositorio/`.

## Antes de homologar
Preserve a versão anterior e um backup íntegro externo. Feche abas/PWAs anteriores. Use dados fictícios e navegador/perfil de ensaio. Mudar de arquivo local para HTTPS ou mudar origem/perfil não transfere automaticamente o localStorage: use importação validada de backup. Não apague localStorage para corrigir divergências.

A primeira carga precisa de rede. A disponibilidade offline só pode ser verificada depois da instalação completa do shell e controle pelo SW; não basta abrir o HTML uma vez. HTTPS é necessário no aparelho; HTTP localhost foi usado somente no teste técnico local.

## Atualização/cache
- HTML e recursos essenciais consultam a rede primeiro. Cache HTTP é revalidado; registro SW usa updateViaCache none.
- Falha de rede ou 5xx usa o recurso previamente salvo. 404 é mostrado como erro do servidor, sem mascarar publicação incompleta.
- O worker novo aguarda encerramento dos clientes antigos. Não força recarga durante edição. Após atualização futura, salvar, exportar backup, fechar todas as abas e janelas PWA e reabrir online; conferir versão no diagnóstico.
- Uma aba já aberta não troca seu JavaScript automaticamente. Uma nova navegação online pode obter HTML mais novo antes da ativação do worker. Isso é compatível neste RC porque o app é autocontido e não houve migração de schema.
- Toda futura alteração de shell deve usar nova identificação de cache e atualizar a verificação do marcador de versão no install. Nunca reutilizar o cache RC1 para um release diferente.
- Servidor/CDN ainda pode entregar conteúdo desatualizado. Na publicação futura, conferir bytes/hashes e usar revalidação para index.html e sw.js. O código não controla cabeçalhos do provedor.
- Não há timeout artificial para rede lenta. A resposta pode demorar se o navegador ainda considerar a conexão ativa.

Cache Storage contém somente shell. Escalas continuam nas chaves locais existentes. Limpeza do cache não apaga localStorage; testes do worker não oferecem nenhuma API para gravar os dados operacionais.

O worker ignora POST, outras origens, outras subpastas e recursos fora da lista essencial. Limpeza considera apenas prefixo próprio e escopo exato. Aplicações CBSI diferentes não devem compartilhar o mesmo escopo de instalação.

## Persistência e limitações
Mantidos schema 113, compatibilidade dark/light, isolamento de parsing por chave, fallback temporário por falha real e restauração validada. APROVADO no diagnóstico de leitura não garante quota para escrita. Registros corrompidos não são reconstruídos automaticamente; preserve o último backup íntegro. Exportações podem omitir bytes ilegíveis. Não abrir versões antigas concorrentes no mesmo armazenamento.

Sem Programação, múltiplas atribuições/refeição, arquivamento de postos/turnos e validação RH/jurídica continuam pendentes. Não há alegação de conformidade legal.

## Homologação
Siga ANDROID_TEST_PLAN e preencha evidências, sem presumir PASS. O RELEASE_CHECKLIST separa os resultados automáticos das pendências físicas. Fontes de teste/resultados estão na pasta qa; dependências de QA são Node e @napi-rs/canvas, não usadas pelo aplicativo em produção. Execute a partir da pasta PWA: `node qa/regression.cjs index.html`, `node qa/archive-session.cjs index.html`, `node qa/hotfix-tests.cjs index.html`, `node qa/microfix-tests.cjs index.html`, `node qa/rc-tests.cjs index.html`.

## Integridade
SHA-256 do HTML/index:
`b620ee17ceb920f01be8122d8f3dda1b745e5a112298431c491ba330b15a79eb`

O hash do ZIP final está no relatório externo entregue ao lado do pacote e em SHA256SUMS.txt. Não se inclui o hash do próprio ZIP dentro dele para evitar autorreferência. O relatório interno registra a mesma execução, sem o hash posterior do contêiner.

Trabalho encerrado no RC1; aguardar auditoria independente antes de publicação controlada.
