#include <iostream>
using namespace std;

int main() {
    int k = 7;
    int i = 2;

    while (i <= 10) {
        cout << k << " x " << i << " = " << k * i << endl;
        i = i + 1;
    }

    system("pause");
}