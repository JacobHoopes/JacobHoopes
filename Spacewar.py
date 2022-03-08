import pygame
import numpy as np
import time

# from typing import Tuple
from random import random

SCREEN_SIZE = 768

SHIP_POWER = 0.1
ROTATION_SPEED = 0.5
MAX_ACCELERATION = 0.5

# CONTROLS
left = pygame.K_LEFT
right = pygame.K_RIGHT
down = pygame.K_DOWN
up = pygame.K_UP


class Entity:
    def __init__(self, position = [0.0,0.0], rotation = 0, size = 0, color = (255, 255, 255)):
        self.position = (position[0], position[1])
        self.rotation = rotation
        self.color = color

class Star(Entity):
    def __init__(self, position):
        super().__init__(position, 0.0, [20, 40])
        self.surface = pygame.Surface([20, 40], pygame.SRCALPHA)


    def draw(self, surface):
        self.surface.fill((0, 0, 0, 0))
        x = random() * 5
        pygame.draw.line(self.surface, self.color, (10, x), (10, 20 - x))
        pygame.draw.line(self.surface, self.color, (x, 10), (20 - x, 10))
        # pygame.draw.line(self.surface, self.color, (5, 5), (20, 10))
        # pygame.draw.line(self.surface, self.color, (5, 5), (20, 10))
        surface.blit(self.surface, self.position)


class Ship(Entity):
    def __init__(self, position = [0.0, 0.0], rotation = 0, velocity = [0.0, 0.0], acceleration = 5):
        super().__init__(position, 0.0, [20, 20])
        self.surface = pygame.Surface([20, 20], pygame.SRCALPHA)
        self.power = SHIP_POWER
        self.position = position
        self.rotation = rotation
        self.velocity = velocity


    def draw(self, surface):
        self.surface.fill((0, 0, 0, 0))
        pygame.draw.line(self.surface, self.color, (0, 0), (20, 0))
        pygame.draw.line(self.surface, self.color, (0, 0), (10, 30))
        pygame.draw.line(self.surface, self.color, (20, 0), (10, 30))
        surface.blit(self.surface, self.position)

    def rotate(self, direction):
        self.rotation = (self.rotation - direction * ROTATION_SPEED / 100) % 360

    def update(self, surface, key):
        self.position = (self.position[0] + self.velocity[0]) % SCREEN_SIZE, (self.position[1] * self.velocity[1]) % SCREEN_SIZE
        # np.cos(self.rotation)
        if key[left]:
            self.rotate(1)
        if key[right]:
            self.rotate(-1)
        if key[down]:
            self.velocity = (np.cos(self.rotation) * self.power + self.velocity[0], 3 + np.sin(self.rotation) * self.power + self.velocity[1])
        if key[up]:
            self.velocity = (self.velocity[0] - self.power, self.velocity[1] - self.power)

if __name__ == "__main__": 
    surface = pygame.display.set_mode((SCREEN_SIZE, SCREEN_SIZE))
    star = Star((SCREEN_SIZE / 2, SCREEN_SIZE / 2))
    ship = Ship((SCREEN_SIZE / 4, SCREEN_SIZE / 4))
    keyPress = pygame.USEREVENT
    pygame.time.set_timer(pygame.USEREVENT, 1000 // 60)
    while True:
        surface.fill((0, 0, 0))
        star.draw(surface)
        ship.draw(surface)
        pygame.display.flip()
        pygame.time.delay(1)
        time.sleep(0.1)
        # event = pygame.event.wait()
        # timer = pygame.time.set_timer(event, 1000, loops=100)
        key = pygame.key.get_pressed()
        # if (key == pygame.K_LEFT) or (key == pygame.K_RIGHT) or (key == pygame.K_UP) or (key == pygame.K_DOWN):
        ship.update(surface, key)
        # if event.type == pygame.USEREVENT:
        #     star.position = (star.position[0] + -1.0, star.position[1])
