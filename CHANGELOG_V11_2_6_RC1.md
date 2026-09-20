# V11.2.6 RC1 — Release Candidate 1

Base: V11.2.5.2 Microfix de Consistência + Diagnóstico. Feature freeze preservado.

## Alterações de código
- Registro do service worker condicionado a contexto seguro HTTP(S), com escopo relativo `./` e `updateViaCache: none`. Falha de registro continua não impedindo o HTML.
- Worker de homologação preparado com cache `cbsi-astra-<escopo codificado>-11.2.6-rc1`, mesma família/escopo dos pacotes anteriores.
- Recursos essenciais passam a priorizar rede com revalidação HTTP. Offline/erro 5xx usa somente cópia previamente disponível do recurso exato. 4xx não é ocultado por HTML antigo.
- Precache exige sucesso de todos os downloads e marcador RC1 no HTML antes de gravar. Sem skipWaiting, reload forçado ou polling de atualização. Ativação limpa somente caches antigos da família no escopo exato.
- Falha de acesso/gravação ao cache não impede uma resposta online válida.

## Alterações somente de versão e empacotamento
Título, diagnóstico, backup e sua nomenclatura, texto de versão do PDF/documentação: V11.2.6 RC1. Schema permanece 113. Index é cópia byte a byte do HTML RC. Manifest relativo com standalone, ícones PNG 192/512 reutilizados e propósito any; não se afirma que o ícone é maskable. Licença de fontes incluída.

## Preservado
Nenhuma alteração em funções de persistência, migração, histórico, arquivamento, validação operacional, transação/rollback, PDF, snapshots ou backup/restauração além dos textos/metadados de versão. Interface sem redesign. Nenhuma chave renomeada. Não adicionados recursos de negócio, bibliotecas, serviços remotos ou coleta de dados.

## Defeito tratado na preparação
O worker anterior priorizava indefinidamente o shell em cache durante navegações sob seu controle, podendo apresentar versão antiga enquanto uma atualização aguardava ativação. O pacote RC usa rede primeiro; mantém segurança da sessão aberta e explicita o fechamento de todas as janelas na atualização.
