class IterableObject:
    def __init__(self, data):
        self.data = data

    def __iter__(self):
        for item in self.data:
            yield item

iterable = IterableObject([1, 2, 3, 4, 5])
for item in iterable:
    print(item)