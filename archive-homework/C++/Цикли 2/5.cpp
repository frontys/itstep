#include <iostream>
using namespace std;

int main() {
    int A;
    cout << "Enter number >>> ";
    cin >> A;

    int sum = 0;
    int temp = A;
    while (temp > 0) {
        sum = sum + (temp % 10);
        temp = temp / 10;
    }

    int cube = sum * sum * sum;
    int square = A * A;

    if (cube == square) {
        cout << "Equal" << endl;
    } else {
        cout << "No equal" << endl;
    }
}