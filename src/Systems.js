// Peca atual que está descendo na matriz
let currentPiece = null

// retorna um numero aleatorio para a peca
const randomBetween = (min, max) => {
  const x = Math.floor(Math.random() * (max - min + 1) + min)
  return x
}

// Cria uma nova peca
// Todas as pecas do jogo TETRIS tem 4 blocos então o quinto elemento da matriz retorno é a cor da peca
// E o sexto (ultimo) elemento da matriz de retorno e o bloco de referencia para girar a peca
const renderPiece = (grid) => {
  // Meio da grid
  const middleColumn = Math.floor(grid[0].length / 2)

  switch (randomBetween(0, 6)) {
    case 0:
      return [[-2, middleColumn - 1], [-2, middleColumn], [-1, middleColumn - 1], [-1, middleColumn], 'blue', null] // []
    case 1:
      return [[-2, middleColumn - 1], [-2, middleColumn], [-2, middleColumn + 1], [-1, middleColumn - 1], 'red', 1] // L
    case 2:
      return [[-2, middleColumn - 1], [-2, middleColumn], [-2, middleColumn + 1], [-1, middleColumn + 1], 'green', 1] // L - invertido
    case 3:
      return [[-1, middleColumn - 1], [-1, middleColumn], [-2, middleColumn], [-2, middleColumn + 1], 'pink', 1] // []S
    case 4:
      return [[-2, middleColumn - 1], [-2, middleColumn], [-1, middleColumn], [-1, middleColumn + 1], 'brown', 1] // S - invertido
    case 5:
      return [[-2, middleColumn - 1], [-2, middleColumn], [-2, middleColumn + 1], [-1, middleColumn], 'yellow', 1] // T
    default:
      return [[-4, middleColumn], [-3, middleColumn], [-2, middleColumn], [-1, middleColumn], 'purple', 1] // I
  }
}

const downPiece = (grid, dispatch) => {
  // copia o conteudo da variavel currentPiece
  const aux = []

  // Desce a peca virtual e retorna false se estiver na ultima posicao
  for (let i = 0; i < 4; i++) {
    aux[i] = []
    aux[i][0] = currentPiece[i][0]
    aux[i][1] = currentPiece[i][1]

    if (aux[i][0] >= 0 && aux[i][0] < grid.length) { grid[aux[i][0]][aux[i][1]] = null }

    aux[i][0]++

    if (aux[i][0] >= grid.length) {
      for (let j = 0; j < 4; j++) {
        grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4]
      }

      return false
    }
  }

  aux[4] = currentPiece[4]
  aux[5] = currentPiece[5]

  // Se a peca virtual tiver uma posicao ocupada ou chegar ao fim da matriz, retorna falso
  for (let i = 0; i < 4; i++) {
    if (aux[i][0] >= 0 && aux[i][0] < grid.length) {
      if (grid[aux[i][0]][aux[i][1]]) {
        for (let j = 0; j < 4; j++) {
          if (currentPiece[j][0] >= 0) { grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4] }
        }

        if (aux[i][0] == 0) {
          dispatch({ type: 'game-over' })
        }

        return false
      }
    }
  }

  // Se nao, copia o novo valor para a peca atual
  for (let i = 0; i < 4; i++) {
    if (aux[i][0] >= 0 && aux[i][0] < grid.length) { grid[aux[i][0]][aux[i][1]] = aux[4] }

    currentPiece[i][0] = aux[i][0]
    currentPiece[i][1] = aux[i][1]
  }

  return true
}

// Movimenta a peca para a esquerda ou direita
const moveLeftOrRight = (direction, grid) => {
  // Guarda a currentPiece em uma variavel usada como uma peca virtual
  const aux = []

  // Verifica se a peca atual esta na borda da grid
  for (i = 0; i < 4; i++) {
    if (direction == 1 && currentPiece[i][1] == grid[0].length - 1) { return } else if (direction == -1 && currentPiece[i][1] == 0) { return }
  }

  // Retira a peca atual da matriz para nao haver colisao com o bloco da propria peca atual
  for (let i = 0; i < 4; i++) {
    if (currentPiece[i][0] >= 0) { grid[currentPiece[i][0]][currentPiece[i][1]] = null }
  }

  // Movimenta a peca virtual na horizontal
  for (let i = 0; i < 4; i++) {
    aux[i] = []

    aux[i][0] = currentPiece[i][0]
    aux[i][1] = currentPiece[i][1]

    aux[i][1] += direction
  }

  aux[4] = currentPiece[4]
  aux[5] = currentPiece[5]

  // Verifica se a posicao esta ocupada -> nao move a peca
  for (i = 0; i < 4; i++) {
    if (aux[i][0] >= 0 && grid[aux[i][0]][aux[i][1]]) {
      for (let j = 0; j < 4; j++) {
        if (currentPiece[j][0] >= 0) { grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4] }
      }

      return
    }
  }

  for (let i = 0; i < 4; i++) {
    currentPiece[i][0] = aux[i][0]
    currentPiece[i][1] = aux[i][1]

    if (aux[i][0] >= 0 && aux[i][0] < grid.length) { grid[aux[i][0]][aux[i][1]] = aux[4] }
  }
}

// Rotaciona a peca que esta descendo utilizando um algoritmo de rotacao
const rotateCurrentPiece = (grid) => {
  const aux = []

  // Retira a peca atual da matriz para nao haver colisao com o bloco da propria peca atual
  for (let i = 0; i < 4; i++) {
    if (currentPiece[i][0] >= 0) { grid[currentPiece[i][0]][currentPiece[i][1]] = null }
  }

  for (let i = 0; i < 4; i++) {
    aux[i] = []

    aux[i][0] = currentPiece[i][0]
    aux[i][1] = currentPiece[i][1]
  }

  aux[4] = currentPiece[4]
  aux[5] = currentPiece[5]

  for (let i = 0; i < 4; i++) {
    if (i != aux[5] && aux[5]) {
      const newX = aux[i][1] + aux[1][0] - aux[1][1]
      const newY = aux[1][0] + aux[1][1] - aux[i][0]

      aux[i][0] = newX
      aux[i][1] = newY
    }

    if (aux[i][0] >= grid.length || aux[i][1] < 0 || aux[i][1] >= grid[0].length) {
      for (let j = 0; j < 4; j++) {
        if (currentPiece[j][0] >= 0) { grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4] }
      }
      return
    }
  }

  // Se a peca virtual tiver uma posicao ocupada ou em uma das bordas -> nao gira a peca
  for (let i = 0; i < 4; i++) {
    if (aux[i][1] < 0 || aux[i][1] >= grid[0].length) {
      for (let j = 0; j < 4; j++) {
        if (currentPiece[j][0] >= 0) { grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4] }
      }

      return
    }

    if (aux[i][0] >= 0 && aux[i][0] < grid.length && aux[i][1] < grid[0].length && aux[i][1] >= 0) {
      if (grid[aux[i][0]][aux[i][1]]) {
        for (let j = 0; j < 4; j++) {
          if (currentPiece[j][0] >= 0) { grid[currentPiece[j][0]][currentPiece[j][1]] = currentPiece[4] }
        }

        return
      }
    }
  }

  // Se nao, copia o novo valor para a peca atual
  for (let i = 0; i < 4; i++) {
    if (aux[i][0] >= 0 && aux[i][0] < grid.length) { grid[aux[i][0]][aux[i][1]] = aux[4] }

    currentPiece[i][0] = aux[i][0]
    currentPiece[i][1] = aux[i][1]
  }
}

export const GameLoop = (entities, { touches, dispatch, events }) => {
  // Matriz
  const grid = entities.grid.grid

  // Se nao existir uma peca atual, renderiza um nova peca
  currentPiece = (!currentPiece) ? renderPiece(grid) : currentPiece

  // Eventos das pecas
  if (events.length) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].type === 'move-left') {
        moveLeftOrRight(-1, grid)
      } else if (events[i].type === 'move-right') {
        moveLeftOrRight(1, grid)
      } else if (events[i].type === 'rotate') {
        rotateCurrentPiece(grid)
      } else if (events[i].type === 'slide') {
        // Desce a peca ate retornar nulo
        while (downPiece(grid, dispatch));
      }
    }
  }

  // If para a velocidade do jogo
  entities.grid.nextMove -= 1
  if (entities.grid.nextMove === 0) {
    entities.grid.nextMove = entities.grid.updateFrequency

    // Desliza uma peca na matriz
    // se o retorno for falso entao a peca atual passa a ser nula
    if (!downPiece(grid, dispatch)) {
      currentPiece = null

      let bonus = 0

      for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i].filter((value) => { return value === null }).length == 0) {
          grid.splice(i, 1)

          const newLine = []

          for (let j = 0; j < grid[0].length; j++) { newLine[j] = null }

          grid.unshift(newLine)

          i++

          dispatch({ type: 'add-score', score: 100 * (++bonus) })
        }
      }
    }
  }

  return entities
}
