class IterableObject:
    def __iter__(self):
        return self.generator()

    def generator(self):
        for i in range(10):
            yield i

iterable = IterableObject()
for value in iterable:
    print(value)