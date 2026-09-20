# Checklist de release — V11.2.6 RC1

## Automatizado
- APROVADO: 170 verificações acumuladas (106 + 21 + 29 + 14); suíte de 106 repetida em dois fusos, sem dobrar contagem.
- APROVADO: 19 verificações PWA simuladas + 5 de RC/registro/duplicação.
- APROVADO: cinco recursos via HTTP local, conteúdo e MIME.
- Resultado de ZIP: consultar relatório final externo.

## Inspeção estática
- APROVADO: schema 113 e chaves mantidos, app autocontido, caminhos relativos, sintaxe e versionamento RC1.
- APROVADO: index idêntico ao HTML; ícones existentes e dimensões declaradas.
- APROVADO: SW limita cache a shell, origem/escopo/lista; sem skipWaiting ou reload.

## Browser real
- PENDENTE: execução integral em navegador, cliques, downloads, console, duas abas, teclado e acessibilidade.

## Android real
- PENDENTE: roteiro completo e evidências em aparelho físico; viewports 360×800, 393×873 e 412×915 quando disponíveis, landscape e zoom.

## PWA instalada
- PENDENTE: instalação, primeira carga completa, reabertura offline, retorno online, atualização RC1→release futuro e preservação de dados.

## Dados/backup
- APROVADO AUTOMATIZADO: migração, parsing por chave, tema legado, quota simulada, transação/rollback, snapshots, importação/exportação e histórico.
- PENDENTE REAL: persistência após encerramento do Chrome/PWA, backup em Downloads e restauração de ensaio.

## PDF
- APROVADO AUTOMATIZADO: contextual semanal/especial, HE, nomes longos e paginação com funções reais.
- PENDENTE REAL: download/abertura Android, impressão, compartilhamento e leitura mobile dos PDFs RC.

## Pendências empresariais
- PENDENTE: significado de Sem Programação e tratamento de cobertura.
- PENDENTE: múltiplas atribuições e intervalo de refeição único; proteção atual mantida.
- PENDENTE: vigência/arquivamento de postos e turnos; proteção histórica mantida.
- PENDENTE: confirmação RH/jurídica das referências operacionais; sem conformidade automática.

## Gate
- PENDENTE: auditoria independente do RC.
- PENDENTE: autorização posterior para publicação controlada e execução do roteiro.
- NÃO APROVADO PARA PRODUÇÃO: este pacote é candidato para homologação, não aceite de campo.
